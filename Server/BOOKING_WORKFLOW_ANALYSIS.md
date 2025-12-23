# 📋 Phân tích Workflow đặt vé xem phim - CineBook

> **Ngày phân tích:** 21/12/2025  
> **Hệ thống:** ASP.NET Core + PostgreSQL

---

## 📌 I. WORKFLOW HIỆN TẠI

### **1. Luồng đặt vé Guest (Khách hàng không đăng nhập)**

**Endpoint:** `POST /api/Booking/create`

```
┌─────────────────────────────────────────────────────────────────┐
│                   WORKFLOW ĐẶT VÉ GUEST                          │
└─────────────────────────────────────────────────────────────────┘

  Client Request
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 1: Validate Showtime                                        │
│ ─────────────────────────────                                    │
│ • Query: Showtimes + Movies + Rooms + Theater                    │
│ • Check: Suất chiếu có tồn tại?                                  │
│ • ❌ Throw Exception nếu không tìm thấy                          │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 2: Validate Seats (Ghế)                                     │
│ ─────────────────────────────                                    │
│ • Query: Seats by IDs                                            │
│ • Check: Số lượng ghế có khớp?                                   │
│ • Check: Ghế có thuộc phòng chiếu không?                         │
│ • ❌ Throw Exception nếu không hợp lệ                            │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 3: Kiểm tra ghế đã được đặt chưa                            │
│ ─────────────────────────────────────────────                    │
│ • Query: StatusSeat WHERE SeatId IN (...) AND ShowtimeId = X     │
│ • Filter: Status = "Booked" OR Status = "Pending"                │
│ • ❌ Throw Exception nếu ghế đã được đặt                         │
│                                                                   │
│ ⚠️ VẤNĐỀ: RACE CONDITION có thể xảy ra tại đây!                 │
│    Nếu 2 request cùng kiểm tra lúc ghế chưa booked,              │
│    cả 2 đều pass và có thể book trùng ghế!                       │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 4: Tìm/Tạo Customer                                         │
│ ─────────────────────────────                                    │
│ • Service: CustomerService.FindOrCreateByPhoneAsync()            │
│ • Logic: Tìm theo Phone, nếu không có thì tạo mới                │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 5: Tính tổng tiền                                           │
│ ─────────────────────────                                        │
│ • Logic: totalAmount = SUM(seats.Price)                          │
│ • Source: Seats.Price (từ Seats table)                           │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 6: Tạo Ticket (Vé)                                          │
│ ─────────────────────────                                        │
│ • INSERT INTO Ticket                                             │
│ • Fields: CustomerId, ShowtimeId, SeatId (first), RoomId,        │
│           MovieId, TotalPrice, Date, SumOfSeat                   │
│ • SaveChanges() → Lấy TicketId                                   │
│                                                                   │
│ ⚠️ VẤN ĐỀ: Model Ticket chỉ có 1 SeatId nhưng book nhiều ghế    │
│    → Hiện tại lưu ghế đầu tiên, không đầy đủ!                    │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 7: Tạo Payment                                              │
│ ─────────────────────────                                        │
│ • INSERT INTO Payment                                            │
│ • Fields: TicketId, TotalPrice, PaymentMethod, Date              │
│ • Status: "Chưa Thanh toán"                                      │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 8: Cập nhật StatusSeat                                      │
│ ─────────────────────────────────                                │
│ • INSERT INTO StatusSeat (N records - mỗi ghế 1 record)          │
│ • Fields: SeatId, ShowtimeId, Status = "Pending"                 │
│ • SaveChanges() → Commit vào DB                                  │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 9: Trả về BookingResponseDto                                │
│ ─────────────────────────────────────────                        │
│ • TicketId, BookingCode, ShowtimeId, MovieTitle                  │
│ • RoomName, ShowtimeStart, SeatNumbers                           │
│ • TotalAmount, PaymentMethod, PaymentStatus = "Pending"          │
└──────────────────────────────────────────────────────────────────┘
       │
       ▼
    Response 200 OK
```

---

### **2. Luồng đặt vé Staff (Tại quầy - Thanh toán tiền mặt)**

**Endpoint:** `POST /api/Booking/create-by-staff`  
**Authorization:** `[Authorize(Policy = "StaffOrAdmin")]`

**Khác biệt so với Guest:**
- ✅ Yêu cầu JWT token (Staff/Admin)
- ✅ Tự động lấy `staffId` từ JWT Claims
- ✅ Status ghế: `"Booked"` (đã thanh toán ngay)
- ✅ Payment Status: `"Đã Thanh toán"`
- ✅ Tính tiền thối: `ChangeAmount = PaidAmount - TotalAmount`

---

## 📊 II. CÁC BẢNG LIÊN QUAN TRONG QUÁ TRÌNH ĐẶT VÉ

### **1. Bảng chính được query/modify:**

| **Bảng** | **Operation** | **Mục đích** | **Số lần truy cập** |
|----------|---------------|--------------|---------------------|
| **Showtimes** | `SELECT` (Include Movies, Rooms, Theater) | Validate suất chiếu + lấy thông tin phim/phòng | 1 lần |
| **Seats** | `SELECT` | Validate ghế + Lấy giá | 1 lần |
| **StatusSeat** | `SELECT` + `INSERT` | Kiểm tra ghế đã đặt chưa + Đánh dấu ghế đã book | 2 lần |
| **Customers** | `SELECT` / `INSERT` | Tìm hoặc tạo khách hàng | 1-2 lần |
| **Ticket** | `INSERT` | Tạo vé | 1 lần |
| **Payment** | `INSERT` | Tạo thông tin thanh toán | 1 lần |

### **2. Mối quan hệ giữa các bảng:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA FLOW                          │
└─────────────────────────────────────────────────────────────────┘

    Theater (Rạp)
        │
        │ 1:N
        ▼
    Rooms (Phòng chiếu)
        │
        ├───────┬──────────┐
        │ 1:N   │ 1:N      │ 1:N
        ▼       ▼          ▼
    Seats   Showtimes   TicketPrice
        │       │
        │       │ N:1
        │       ▼
        │    Movies (Phim)
        │
        │
        │ N:N (thông qua StatusSeat)
        ▼
    StatusSeat ──────┐
        │            │
        │ N:1        │ N:1
        ▼            ▼
    Ticket ←──── Customer
        │
        │ 1:1
        ▼
    Payment
```

### **3. Chi tiết schema các bảng quan trọng:**

#### **StatusSeat** (Bảng trạng thái ghế)
```csharp
StatusSeat {
    Id: int (PK)
    SeatId: int (FK → Seats)
    ShowtimeId: int (FK → Showtimes)
    Status: string ("Available", "Pending", "Booked")
}
```
**Vai trò:**
- ✅ Lưu trạng thái ghế cho TỪNG suất chiếu
- ✅ Ngăn chặn đặt trùng ghế
- ⚠️ **VẤNĐỀ:** Không có cơ chế lock → Race condition

#### **Ticket** (Vé)
```csharp
Ticket {
    Id: int (PK)
    ShowtimeId: int (FK → Showtimes)
    CustomerId: int (FK → Customer)
    SeatId: int (FK → Seats)       ⚠️ Chỉ lưu 1 ghế!
    RoomId: int
    MovieId: int
    SumOfSeat: int                 ✅ Lưu số lượng ghế
    Date: DateOnly
    TotalPrice: int
}
```
**Vấn đề thiết kế:**
- ⚠️ `SeatId` chỉ lưu 1 ghế, nhưng `SumOfSeat` có thể > 1
- ❌ Không thể query chính xác tất cả ghế của 1 vé
- 💡 **Đề xuất:** Tạo bảng `TicketDetail` (1:N với Ticket)

#### **Payment** (Thanh toán)
```csharp
Payment {
    Id: int (PK)
    TicketId: int (FK → Ticket) [UNIQUE]
    TotalPrice: int
    Date: DateOnly
    Status: string ("Đã Thanh toán", "Chưa Thanh toán", "Thanh toán thất bại")
    paymentMethod: string ("Momo", "Banking", "Cash")
}
```

---

## ✅ III. ƯU ĐIỂM CỦA HỆ THỐNG HIỆN TẠI

### **1. Thiết kế rõ ràng, dễ hiểu**
- ✅ Workflow đơn giản, logic xử lý tuần tự
- ✅ Tách biệt rõ ràng giữa Guest và Staff booking
- ✅ Sử dụng DTO pattern chuẩn

### **2. Quản lý trạng thái ghế**
- ✅ Có bảng `StatusSeat` riêng để track trạng thái ghế theo suất chiếu
- ✅ Phân biệt 2 trạng thái: `"Pending"` (chờ thanh toán) và `"Booked"` (đã thanh toán)

### **3. Tính linh hoạt**
- ✅ Hỗ trợ nhiều phương thức thanh toán (Cash, Momo, Banking)
- ✅ Tự động tạo Customer nếu chưa có (tìm theo Phone)
- ✅ Tính toán giá vé tự động từ `Seats.Price`

### **4. Authorization phân quyền tốt**
- ✅ Guest không cần đăng nhập
- ✅ Staff/Admin phải xác thực qua JWT
- ✅ Sử dụng Policy-based authorization

---

## ❌ IV. KHUYẾT ĐIỂM VÀ RỦI RO

### **🔴 1. RACE CONDITION - Vấn đề nghiêm trọng nhất**

**Tình huống:**
```
Time  | User A                        | User B
─────────────────────────────────────────────────────────
T0    | Request book Ghế A1            |
T1    | ✓ Check: Ghế A1 available      |
T2    |                                | Request book Ghế A1
T3    |                                | ✓ Check: Ghế A1 available
T4    | ✓ Insert StatusSeat (A1)       |
T5    |                                | ✓ Insert StatusSeat (A1)
─────────────────────────────────────────────────────────
Kết quả: 🔥 CẢ 2 CÙNG BOOK GHẾ A1 THÀNH CÔNG!
```

**Nguyên nhân:**
- ❌ Không có cơ chế lock
- ❌ Query kiểm tra và Insert không atomic
- ❌ PostgreSQL không tự động serialize concurrent transactions

**Tác động:**
- 💥 Khách hàng book trùng ghế
- 💥 Mất uy tín hệ thống
- 💥 Phải refund, xử lý thủ công

---

### **🟠 2. Thiếu cơ chế giữ ghế tạm thời (Seat Hold)**

**Hiện trạng:**
- ❌ Không có timeout cho trạng thái `"Pending"`
- ❌ Ghế `"Pending"` có thể bị giữ vô hạn nếu user không thanh toán
- ❌ Làm giảm tỷ lệ ghế available

**Kịch bản:**
1. User A book ghế, nhận mã vé, status = `"Pending"`
2. User A không thanh toán, đóng trình duyệt
3. Ghế bị lock mãi mãi → User B không thể book

**Thiếu chức năng:**
- ⏱️ Không có TTL (Time-To-Live) cho Pending status
- 🔄 Không có background job tự động release ghế
- 📱 Không có real-time notification cho user

---

### **🟠 3. Thiết kế database chưa tối ưu**

**Vấn đề Model Ticket:**
```csharp
public class Ticket {
    public int SeatId { get; set; }      // ⚠️ Chỉ lưu 1 ghế
    public int SumOfSeat { get; set; }   // ⚠️ Chỉ lưu số lượng
    // ❌ Không lưu danh sách tất cả ghế!
}
```

**Hậu quả:**
- ❌ Không query được tất cả ghế của 1 vé
- ❌ Phải query qua `StatusSeat` (gián tiếp)
- ❌ Khó xử lý refund từng ghế

**Đề xuất:**
```csharp
// Tạo bảng TicketDetail
TicketDetail {
    Id: int (PK)
    TicketId: int (FK → Ticket)
    SeatId: int (FK → Seats)
    Price: int
}
// → Ticket 1:N TicketDetail
```

---

### **🟠 4. Thiếu validation và error handling**

**Các trường hợp chưa xử lý:**
- ❌ Không check suất chiếu đã qua giờ chưa
- ❌ Không check số lượng ghế tối đa 1 booking (có thể book cả rạp?)
- ❌ Không validate Email format
- ❌ Không check duplicate booking của cùng 1 Customer

**Code hiện tại:**
```csharp
// ❌ Không kiểm tra thời gian
var showtime = await _context.Showtimes.FirstOrDefaultAsync(...);
// → Nếu showtime.Date + Start < DateTime.Now → Vẫn cho book!
```

---

### **🟠 5. Performance issues**

**Multiple queries không cần thiết:**
```csharp
// Query 1: Lấy bookedSeatIds
var bookedSeatIds = await _context.StatusSeat
    .Where(...).Select(ss => ss.SeatId).ToListAsync();

// Query 2: Lấy bookedSeatNames (nếu có trùng)
var bookedSeatNames = await _context.Seats
    .Where(s => bookedSeatIds.Contains(s.Id))
    .Select(s => s.Name).ToListAsync();
```
**Đề xuất:** Join 1 lần, lấy cả Id và Name

---

### **🟠 6. Thiếu transaction rollback**

**Rủi ro:**
```csharp
_context.Ticket.Add(ticket);
await _context.SaveChangesAsync();    // ✓ Ticket tạo thành công

_context.Payment.Add(payment);
// ❌ Nếu lỗi ở đây → Ticket đã tạo nhưng Payment chưa có!
```

**Đề xuất:** Wrap toàn bộ trong `BeginTransaction()`

---

### **🟠 7. Không có audit log**

**Thiếu trường:**
- ❌ `CreatedAt`, `UpdatedAt`
- ❌ `CreatedBy`, `UpdatedBy`
- ❌ Log history khi thay đổi trạng thái

---

## 💡 V. ĐỀ XUẤT GIẢI PHÁP: REDIS CHO SEAT RESERVATION

### **✅ Tại sao nên dùng Redis?**

| **Lý do** | **Giải thích** |
|-----------|----------------|
| **⚡ Tốc độ cao** | In-memory database, sub-millisecond latency |
| **🔒 Atomic operations** | `SETNX`, `GETSET` đảm bảo thread-safe |
| **⏱️ TTL tự động** | `EXPIRE` tự động xóa key sau N giây |
| **📊 Distributed lock** | Hỗ trợ `Redlock` algorithm |
| **📈 Scalability** | Dễ scale horizontal với Redis Cluster |

---

### **🏗️ Kiến trúc đề xuất: REDIS + PostgreSQL**

```
┌─────────────────────────────────────────────────────────────────┐
│            HYBRID ARCHITECTURE: REDIS + POSTGRESQL               │
└─────────────────────────────────────────────────────────────────┘

                        ┌───────────────┐
                        │   CLIENT      │
                        └───────┬───────┘
                                │
                                │ 1. POST /api/Booking/create
                                ▼
                    ┌───────────────────────┐
                    │   BookingController    │
                    └───────────┬───────────┘
                                │
                                │ 2. Call Service
                                ▼
                    ┌───────────────────────┐
                    │   BookingService      │
                    └───────────┬───────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐     ┌────────────────┐
│ REDIS CACHE   │      │  PostgreSQL   │     │ Redis Lock     │
│ (Seat Hold)   │      │  (Persistent) │     │ (Distributed)  │
└───────────────┘      └───────────────┘     └────────────────┘

    ⏱️ TTL 10 phút         💾 Lưu vĩnh viễn        🔒 Prevent race


┌─────────────────────────────────────────────────────────────────┐
│                   REDIS KEY STRUCTURE                            │
└─────────────────────────────────────────────────────────────────┘

seat_hold:{showtimeId}:{seatId} → {userId/sessionId}  [TTL: 600s]
booking_lock:{showtimeId}       → "locked"            [TTL: 5s]
available_seats:{showtimeId}    → SET{seatIds}        [No expiry]
```

---

### **📝 WORKFLOW MỚI VỚI REDIS**

#### **Phase 1: Chọn ghế (Seat Selection)**

```http
POST /api/Booking/hold-seats
```

**Request:**
```json
{
  "showtimeId": 123,
  "seatIds": [45, 46, 47],
  "sessionId": "uuid-v4-user-session"
}
```

**Workflow:**
```csharp
public async Task<SeatHoldResponseDto> HoldSeatsAsync(HoldSeatsDto dto)
{
    // 1. Acquire distributed lock (Redlock)
    var lockKey = $"booking_lock:{dto.ShowtimeId}";
    using var redisLock = await _distributedLock.AcquireAsync(lockKey, TimeSpan.FromSeconds(5));
    
    if (redisLock == null)
        throw new Exception("Hệ thống đang bận, vui lòng thử lại");

    // 2. Validate showtime trong PostgreSQL
    var showtime = await _context.Showtimes.FindAsync(dto.ShowtimeId);
    if (showtime == null || showtime.Start < DateTime.Now)
        throw new Exception("Suất chiếu không hợp lệ");

    // 3. Kiểm tra ghế đã hold chưa (REDIS)
    var redis = _connectionMultiplexer.GetDatabase();
    var unavailableSeats = new List<int>();
    
    foreach (var seatId in dto.SeatIds)
    {
        var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
        var existingHolder = await redis.StringGetAsync(holdKey);
        
        if (!existingHolder.IsNullOrEmpty && existingHolder != dto.SessionId)
        {
            unavailableSeats.Add(seatId);
        }
    }

    if (unavailableSeats.Any())
        throw new Exception($"Ghế {string.Join(",", unavailableSeats)} đã được giữ bởi người khác");

    // 4. Kiểm tra ghế đã booked trong PostgreSQL
    var bookedSeats = await _context.StatusSeat
        .Where(ss => dto.SeatIds.Contains(ss.SeatId)
                  && ss.ShowtimeId == dto.ShowtimeId
                  && ss.Status == "Booked")
        .Select(ss => ss.SeatId)
        .ToListAsync();

    if (bookedSeats.Any())
        throw new Exception($"Ghế {string.Join(",", bookedSeats)} đã được đặt");

    // 5. Hold ghế trong REDIS với TTL 10 phút
    var holdExpiry = TimeSpan.FromMinutes(10);
    foreach (var seatId in dto.SeatIds)
    {
        var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
        await redis.StringSetAsync(holdKey, dto.SessionId, holdExpiry);
    }

    // 6. Trả về thông tin hold
    return new SeatHoldResponseDto
    {
        HoldToken = Guid.NewGuid().ToString(), // Token để confirm booking
        ExpiresAt = DateTime.Now.AddMinutes(10),
        SeatIds = dto.SeatIds,
        Message = "Ghế đã được giữ trong 10 phút. Vui lòng thanh toán!"
    };
}
```

**Response:**
```json
{
  "holdToken": "abc123xyz",
  "expiresAt": "2025-12-21T14:30:00Z",
  "seatIds": [45, 46, 47],
  "message": "Ghế đã được giữ trong 10 phút. Vui lòng thanh toán!"
}
```

---

#### **Phase 2: Thanh toán (Confirm Booking)**

```http
POST /api/Booking/confirm
```

**Request:**
```json
{
  "holdToken": "abc123xyz",
  "showtimeId": 123,
  "seatIds": [45, 46, 47],
  "sessionId": "uuid-v4-user-session",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerEmail": "a@gmail.com",
  "paymentMethod": "Banking"
}
```

**Workflow:**
```csharp
public async Task<BookingResponseDto> ConfirmBookingAsync(ConfirmBookingDto dto)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        // 1. Verify hold token (optional: lưu mapping holdToken → sessionId trong Redis)
        
        // 2. Verify ghế vẫn đang hold bởi user này
        var redis = _connectionMultiplexer.GetDatabase();
        foreach (var seatId in dto.SeatIds)
        {
            var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
            var holder = await redis.StringGetAsync(holdKey);
            
            if (holder.IsNullOrEmpty || holder != dto.SessionId)
                throw new Exception($"Ghế {seatId} không còn được giữ cho bạn!");
        }

        // 3. Double-check trong PostgreSQL (để chắc chắn)
        var bookedSeats = await _context.StatusSeat
            .Where(ss => dto.SeatIds.Contains(ss.SeatId)
                      && ss.ShowtimeId == dto.ShowtimeId
                      && ss.Status == "Booked")
            .AnyAsync();

        if (bookedSeats)
            throw new Exception("Ghế đã được đặt bởi người khác!");

        // 4. Tạo Customer, Ticket, Payment (giống cũ)
        var customer = await _customerService.FindOrCreateByPhoneAsync(
            dto.CustomerPhone, dto.CustomerName, dto.CustomerEmail
        );

        var seats = await _context.Seats
            .Where(s => dto.SeatIds.Contains(s.Id))
            .ToListAsync();

        var totalAmount = (int)seats.Sum(s => s.Price);

        var ticket = new Ticket
        {
            CustomerId = customer.Id,
            ShowtimeId = dto.ShowtimeId,
            // ... (các field khác)
            TotalPrice = totalAmount
        };

        _context.Ticket.Add(ticket);
        await _context.SaveChangesAsync();

        var payment = new Payment
        {
            TicketId = ticket.Id,
            TotalPrice = totalAmount,
            paymentMethod = dto.PaymentMethod,
            Status = "Chưa Thanh toán"
        };

        _context.Payment.Add(payment);

        // 5. Cập nhật StatusSeat = "Booked"
        var statusSeats = dto.SeatIds.Select(seatId => new StatusSeat
        {
            SeatId = seatId,
            ShowtimeId = dto.ShowtimeId,
            Status = "Booked"
        }).ToList();

        _context.StatusSeat.AddRange(statusSeats);
        await _context.SaveChangesAsync();

        // 6. Xóa hold keys trong Redis
        foreach (var seatId in dto.SeatIds)
        {
            var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
            await redis.KeyDeleteAsync(holdKey);
        }

        // 7. Commit transaction
        await transaction.CommitAsync();

        // 8. Return response
        return new BookingResponseDto
        {
            TicketId = ticket.Id,
            BookingCode = ticket.Id.ToString("D8"),
            // ... (các field khác)
        };
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        throw;
    }
}
```

---

#### **Phase 3: Background Job - Cleanup expired holds**

**Sử dụng:** Hangfire hoặc Quartz.NET

```csharp
public class SeatHoldCleanupJob : IJob
{
    private readonly IConnectionMultiplexer _redis;
    
    public async Task Execute(IJobExecutionContext context)
    {
        // Redis tự động xóa key hết TTL
        // Job này chỉ cần log hoặc notify user (nếu có lưu thông tin)
        
        // Optional: Query Redis để lấy các key sắp hết hạn và gửi reminder
        var redis = _redis.GetDatabase();
        var server = _redis.GetServer(_redis.GetEndPoints().First());
        
        var expiringSoonKeys = server.Keys(pattern: "seat_hold:*")
            .Where(key => 
            {
                var ttl = redis.KeyTimeToLive(key);
                return ttl.HasValue && ttl.Value.TotalMinutes <= 2;
            });

        foreach (var key in expiringSoonKeys)
        {
            // Gửi notification: "Còn 2 phút để hoàn tất thanh toán!"
        }
    }
}
```

---

### **📦 NuGet Packages cần cài đặt**

```bash
dotnet add package StackExchange.Redis
dotnet add package RedLock.net
dotnet add package Hangfire.AspNetCore
dotnet add package Hangfire.PostgreSql
```

---

### **⚙️ Cấu hình Redis trong appsettings.json**

```json
{
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "CineBook:",
    "SeatHoldTTLMinutes": 10
  }
}
```

**Cấu hình trong Program.cs:**
```csharp
// Redis configuration
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var configuration = ConfigurationOptions.Parse(
        builder.Configuration["Redis:ConnectionString"]!, 
        true
    );
    return ConnectionMultiplexer.Connect(configuration);
});

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = builder.Configuration["Redis:InstanceName"];
});

// Distributed lock
builder.Services.AddSingleton<IDistributedLockFactory>(sp =>
{
    var redis = sp.GetRequiredService<IConnectionMultiplexer>();
    var multiplexers = new List<RedLockMultiplexer> 
    { 
        new RedLockMultiplexer(redis.GetEndPoints().First().ToString()) 
    };
    return RedLockFactory.Create(multiplexers);
});
```

---

## 📊 VI. SO SÁNH TRƯỚC VÀ SAU KHI DÙNG REDIS

| **Tiêu chí** | **TRƯỚC (Chỉ PostgreSQL)** | **SAU (Redis + PostgreSQL)** |
|--------------|----------------------------|------------------------------|
| **Race condition** | ❌ Có thể book trùng ghế | ✅ Redlock ngăn chặn hoàn toàn |
| **Giữ ghế tạm** | ❌ Không có | ✅ TTL 10 phút tự động release |
| **Performance** | 🟠 Query DB mỗi lần check | ✅ Redis in-memory, sub-ms latency |
| **Scalability** | 🟠 DB connection pool limited | ✅ Redis Cluster scale dễ dàng |
| **Real-time** | ❌ Không hỗ trợ | ✅ Pub/Sub cho real-time updates |
| **Complexity** | 🟢 Đơn giản | 🟠 Phức tạp hơn (2 datasources) |
| **Cost** | 💰 Thấp | 💰💰 Cao hơn (infrastructure) |

---

## 🎯 VII. KẾT LUẬN VÀ ROADMAP

### **✅ Đề xuất cuối cùng:**

**SỬ DỤNG REDIS** - Lý do:
1. ✅ Giải quyết triệt để race condition
2. ✅ Tính năng giữ ghế 10 phút là yêu cầu bắt buộc → Redis TTL là giải pháp tối ưu
3. ✅ Cải thiện performance đáng kể
4. ✅ Hỗ trợ real-time features trong tương lai (WebSocket + Redis Pub/Sub)
5. ✅ Standard trong ngành (Ticketmaster, Fandango đều dùng)

### **📅 Roadmap triển khai:**

#### **Phase 1: MVP (2 tuần)** - ✅ **100% HOÀN THÀNH**
- [x] Cài đặt Redis + StackExchange.Redis
- [x] Implement `HoldSeatsAsync()` với Redis TTL (RedisTestController)
- [x] Implement `ConfirmBookingAsync()` với transaction (BookingController)
- [x] Unit tests (11 test cases) + Integration tests (5 test cases)
- [x] Manual testing documentation (22 test scenarios)
- [x] Fix idempotent hold logic

#### **Phase 2: Enhancement (1 tuần)** - ⚡ **60% ĐANG THỰC HIỆN**
- [x] Install RedLock.net package
- [x] Create DistributedLockService
- [x] Add health checks (PostgreSQL + Redis at `/health` endpoint)
- [x] Background job cleanup (Hangfire) - **⚠️ Disabled vì Redis TTL đã tự động cleanup**
- [ ] Implement distributed locks trong BookingController
- [ ] Setup Redis Insight cho monitoring
- [ ] Load testing với k6/JMeter

#### **Phase 3: Real-time (1 tuần)** - ❌ CHƯA BẮT ĐẦU
- [ ] WebSocket/SignalR cho seat availability
- [ ] Redis Pub/Sub cho broadcast updates
- [ ] Frontend countdown timer (10 phút)
- [ ] Real-time notifications khi ghế sắp hết hạn

#### **Phase 4: Optimization (tuần 5+)** - ❌ CHƯA BẮT ĐẦU
- [ ] Redis Cluster setup
- [ ] Cache warming strategies
- [ ] Performance benchmarking
- [ ] Load testing (JMeter/k6)
- [ ] Redis Sentinel for high availability

---

### **🛠️ Alternative nếu KHÔNG dùng Redis:**

Nếu không thể setup Redis, có thể dùng:

1. **PostgreSQL Advisory Locks:**
   ```sql
   SELECT pg_advisory_lock(showtimeId, seatId);
   -- Do booking logic
   SELECT pg_advisory_unlock(showtimeId, seatId);
   ```
   **Nhược điểm:** Không tự động release nếu connection drop

2. **Database-level transaction isolation:**
   ```csharp
   await using var transaction = await _context.Database.BeginTransactionAsync(
       IsolationLevel.Serializable
   );
   ```
   **Nhược điểm:** Performance hit, deadlock risk cao

3. **In-memory cache (MemoryCache):**
   ```csharp
   _memoryCache.Set(holdKey, sessionId, TimeSpan.FromMinutes(10));
   ```
   **Nhược điểm:** Không work với multiple instances (load balancer)

---

## 📚 VIII. TÀI LIỆU THAM KHẢO

- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Redlock Algorithm](https://redis.io/docs/manual/patterns/distributed-locks/)
- [StackExchange.Redis Documentation](https://stackexchange.github.io/StackExchange.Redis/)
- [Designing Data-Intensive Applications - Martin Kleppmann](https://dataintensive.net/)
- [Case Study: Ticketmaster Architecture](https://www.ticketmaster.com/about/tech)

---

**Tài liệu này được tạo bởi:** GitHub Copilot  
**Ngày:** 21/12/2025  
**Version:** 1.0
