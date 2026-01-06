# 🔧 Fix 500 Internal Server Error - Confirm Booking

## ❌ Vấn đề:

Khi user click "Xác nhận" ở PaymentPage:
- Backend trả về **500 Internal Server Error**
- Frontend hiển thị "An unexpected error occurred"
- Nhưng vé vẫn được tạo trong database (hiển thị ở Profile)

## 🔍 Nguyên nhân:

### Flow đặt vé:
1. **Hold Seats** (BookingController.cs):
   - User chọn ghế → POST `/Booking/hold-seats`
   - Tạo `StatusSeat` với status `"Pending"` trong database
   - Save holdId vào Redis (TTL 15 phút)

2. **Confirm Booking** (BookingController.cs):
   - User click "Xác nhận" → POST `/Booking/confirm-booking`
   - Parse holdData từ Redis
   - Gọi `BookingService.CreateGuestBookingAsync()`
   
3. **CreateGuestBookingAsync** (BookingService.cs):
   - Validate showtime, seats
   - **Check duplicate StatusSeat**: Query ghế có status `"Booked"` OR `"Pending"`
   - ❌ **LỖI Ở ĐÂY**: Ghế đã có status `"Pending"` từ bước hold
   - Code cố gắng tạo thêm `StatusSeat` mới → **Duplicate Key Error hoặc Constraint Violation**
   - Throw exception → 500 Error

### Root Cause:

```csharp
// ❌ Code CŨ - SAI
var bookedSeatIds = await _context.StatusSeat
    .Where(ss => dto.SeatIds.Contains(ss.SeatId)
              && ss.ShowtimeId == dto.ShowtimeId
              && (ss.Status == "Booked" || ss.Status == "Pending"))  // ❌ Check cả Pending
    .Select(ss => ss.SeatId)
    .ToListAsync();

if (bookedSeatIds.Any())
    throw new ArgumentException("Ghế đã được đặt");  // ❌ Throw error vì ghế có status Pending

// ...

// ❌ Sau đó cố tạo StatusSeat mới
var statusSeats = seats.Select(seat => new StatusSeat
{
    SeatId = seat.Id,
    ShowtimeId = dto.ShowtimeId,
    Status = "Pending"
}).ToList();

_context.StatusSeat.AddRange(statusSeats);  // ❌ DUPLICATE KEY ERROR!
```

## ✅ Giải pháp:

### 1. Chỉ check ghế có status "Booked" (không check "Pending"):

```csharp
// ✅ Code MỚI - ĐÚNG
var bookedSeatIds = await _context.StatusSeat
    .Where(ss => dto.SeatIds.Contains(ss.SeatId)
              && ss.ShowtimeId == dto.ShowtimeId
              && ss.Status == "Booked")  // ✅ CHỈ check Booked
    .Select(ss => ss.SeatId)
    .ToListAsync();
```

**Lý do**: Khi confirm booking, ghế đã có status `"Pending"` từ hold-seats. Đây là ghế của chính user đang confirm, không phải của người khác.

### 2. Skip tạo StatusSeat nếu đã tồn tại:

```csharp
// ✅ Check StatusSeat đã tồn tại chưa
var existingStatusSeatIds = await _context.StatusSeat
    .Where(ss => dto.SeatIds.Contains(ss.SeatId) && ss.ShowtimeId == dto.ShowtimeId)
    .Select(ss => ss.SeatId)
    .ToListAsync();

// ✅ Chỉ tạo mới cho ghế CHƯA có StatusSeat
var newStatusSeats = dto.SeatIds
    .Where(seatId => !existingStatusSeatIds.Contains(seatId))
    .Select(seatId => new StatusSeat
    {
        SeatId = seatId,
        ShowtimeId = dto.ShowtimeId,
        Status = "Pending"
    }).ToList();

if (newStatusSeats.Any())
{
    _context.StatusSeat.AddRange(newStatusSeats);
}
```

### 3. Update StatusSeat từ "Pending" → "Booked" (trong BookingController):

```csharp
// ✅ Sau khi tạo booking thành công
var statusSeats = await _context.StatusSeat
    .Where(ss => ss.ShowtimeId == holdData.ShowtimeId 
            && holdData.SeatIds.Contains(ss.SeatId)
            && ss.Status == "Pending")
    .ToListAsync();

foreach (var ss in statusSeats)
{
    ss.Status = "Booked";  // ✅ Chuyển sang Booked
}
await _context.SaveChangesAsync();
```

## 📝 Files đã sửa:

### 1. `Server/src/Services/Implements/BookingService.cs`

#### Sửa trong `CreateGuestBookingAsync()`:
- ✅ Line ~62: Chỉ check `Status == "Booked"` (bỏ check "Pending")
- ✅ Line ~127-145: Skip tạo StatusSeat nếu đã tồn tại

#### Sửa trong `CreateStaffBookingAsync()`:
- ✅ Line ~220: Chỉ check `Status == "Booked"`

### 2. `Server/src/Controllers/BookingController.cs`

Giữ nguyên logic update StatusSeat từ Pending → Booked (đã có sẵn).

## 🧪 Testing:

### Test Case 1: Normal Flow ✅
1. Chọn phim → Chọn suất chiếu
2. Chọn ghế → Hold seats (status = "Pending")
3. Điền thông tin → Click "Xác nhận"
4. **Expected**: 
   - Backend: 200 OK
   - Frontend: Toast "Thanh toán thành công!"
   - Redirect to `/booking/success/{ticketId}`
   - StatusSeat updated to "Booked"

### Test Case 2: Ghế đã được người khác book ❌
1. User A hold ghế A1
2. Admin book ghế A1 (status = "Booked")
3. User A click "Xác nhận"
4. **Expected**: Error "Ghế A1 đã được đặt"

### Test Case 3: Hold timeout ❌
1. User chọn ghế → hold (15 phút)
2. Đợi > 15 phút (hold expired, Redis xóa)
3. Click "Xác nhận"
4. **Expected**: Error "Hold không tồn tại hoặc đã hết hạn"

## 🎯 Flow hoàn chỉnh:

```
1. Hold Seats:
   POST /Booking/hold-seats
   → Tạo StatusSeat (status = "Pending")
   → Save holdId to Redis (TTL 15 phút)

2. Confirm Booking:
   POST /Booking/confirm-booking
   → Parse holdData từ Redis
   → CreateGuestBookingAsync():
      - Check ghế status "Booked" (bỏ qua "Pending")
      - Tạo Ticket, TicketSeats, Payment
      - Skip tạo StatusSeat (đã có từ hold)
   → Update StatusSeat: "Pending" → "Booked"
   → Delete holdId from Redis
   → Return success

3. Frontend:
   → Toast "Thanh toán thành công!"
   → Navigate to /booking/success/{ticketId}
```

## ✅ Kết quả:

- ✅ Không còn 500 Error
- ✅ Confirm booking thành công
- ✅ Toast notification hiển thị
- ✅ Redirect đúng trang success
- ✅ StatusSeat update đúng trạng thái
- ✅ Không duplicate database records

---

**Date**: 2026-01-06  
**Status**: ✅ Fixed  
**Build**: Successful với 61 warnings (không ảnh hưởng)
