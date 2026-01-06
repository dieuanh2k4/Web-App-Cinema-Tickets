# 🎫 Hướng dẫn Test Booking System

## 📋 Chuẩn bị

### 1. Tạo Migration
```powershell
cd Server
dotnet ef migrations add AddTicketBookingFields
dotnet ef database update
```

### 2. Khởi động Services
```powershell
# Terminal 1: Start Backend
cd Server
dotnet run

# Terminal 2: Kiểm tra Redis
docker ps | findstr redis
```

---

## 🔐 API Endpoints

### **1. Đăng nhập (Bắt buộc)**
```http
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "a@gmail.com"
  }
}
```

**→ Copy `token` để dùng cho các request sau**

---

### **2. Hold Seats (Giữ ghế)**
```http
POST http://localhost:5001/api/booking/hold-seats
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>

{
  "showtimeId": 1,
  "seatIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đã giữ 3 ghế trong 10 phút",
  "holdId": "abc-123-xyz",
  "showtimeId": 1,
  "seatIds": [1, 2, 3],
  "expiresAt": "2026-01-05T15:30:00Z",
  "ttlSeconds": 600
}
```

**→ Copy `holdId` để dùng cho bước confirm**

---

### **3. Confirm Booking (Xác nhận đặt vé)**
```http
POST http://localhost:5001/api/booking/confirm-booking
Content-Type: application/json
Authorization: Bearer <YOUR_TOKEN>

{
  "holdId": "abc-123-xyz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt vé thành công!",
  "booking": {
    "ticketId": 123,
    "bookingCode": "00000123",
    "totalAmount": 240000,
    "seats": ["A10", "A11", "A12"],
    "movie": "Avatar 3",
    "showtime": "2026-01-15 19:30"
  }
}
```

---

### **4. Staff Booking (Đặt vé tại quầy)**
```http
POST http://localhost:5001/api/booking/create-by-staff
Content-Type: application/json
Authorization: Bearer <STAFF_TOKEN>

{
  "showtimeId": 1,
  "seatIds": [10, 11],
  "customerName": "Tran Thi B",
  "customerPhone": "0987654321",
  "paidAmount": 200000
}
```

---

## 🧪 Test Cases

### ✅ **Test Case 1: Đặt vé thành công**
```
1. Login → Get token
2. Hold seats → Get holdId
3. Confirm booking → Success
4. Kiểm tra database:
   - Tickets table có record mới
   - StatusSeat table có status = "Booked"
   - Payment table có payment record
```

### ⚠️ **Test Case 2: Hold timeout (sau 10 phút)**
```
1. Hold seats → Get holdId
2. Đợi 10 phút
3. Confirm booking → Báo lỗi "Hold đã hết hạn"
4. Kiểm tra Redis:
   - Key đã tự động xóa
```

### 🚫 **Test Case 3: Race condition (2 users cùng chọn 1 ghế)**
```
1. User A: Hold seats [1, 2, 3]
2. User B: Hold seats [2, 3, 4] (đồng thời)
→ User B nhận error: "Ghế 2, 3 đã được giữ bởi người khác"
```

### 🔄 **Test Case 4: User không confirm (bỏ giữa chừng)**
```
1. Hold seats → Get holdId
2. KHÔNG gọi confirm
3. Đợi 10 phút
→ Redis tự động release ghế
→ User khác có thể đặt ghế đó
```

---

## 🔍 Debug Commands

### Kiểm tra Redis
```powershell
# Vào Redis CLI
docker exec -it <redis_container_id> redis-cli

# Xem tất cả keys
KEYS CineBook:*

# Xem hold data
GET CineBook:hold:<holdId>

# Xem seat lock
GET CineBook:seat:1:10

# Xem TTL còn lại
TTL CineBook:hold:<holdId>
```

### Kiểm tra Database
```sql
-- Xem tickets mới nhất
SELECT * FROM "Tickets" ORDER BY "CreatedAt" DESC LIMIT 10;

-- Xem status ghế
SELECT ss.*, s."Name" as SeatName 
FROM "StatusSeat" ss
JOIN "Seats" s ON ss."SeatId" = s."Id"
WHERE ss."ShowtimeId" = 1;

-- Xem payment
SELECT * FROM "Payment" ORDER BY "Date" DESC LIMIT 10;
```

---

## 🐛 Troubleshooting

### Lỗi: "Unauthorized"
→ Token hết hạn hoặc chưa login
→ Gọi lại `/api/auth/login`

### Lỗi: "Hold đã hết hạn"
→ Quá 10 phút kể từ lúc hold
→ Gọi lại `/api/booking/hold-seats`

### Lỗi: "Ghế đã được giữ"
→ Ghế đang bị hold bởi user khác
→ Chọn ghế khác hoặc đợi 10 phút

### Redis không hoạt động
```powershell
# Khởi động lại Redis
docker-compose restart redis

# Hoặc
docker start <redis_container_id>
```

---

## 📊 Monitoring

### Logs cần theo dõi
```
✅ [INFO] Hold seats: ShowtimeId=1, Seats=[1,2,3], HoldId=abc-123
✅ [INFO] Acquired lock: booking:lock:1:1,2,3
✅ [INFO] Released lock: booking:lock:1:1,2,3
✅ [INFO] Booking confirmed: TicketId=123, HoldId=abc-123
⚠️ [WARN] Hold expired: HoldId=abc-123
❌ [ERROR] Seat already held: SeatId=2, ShowtimeId=1
```

---

## 🎯 Next Steps

Sau khi test booking thành công:
1. ✅ Tích hợp VNPay payment
2. ✅ Thêm QR code generation
3. ✅ Email notification
4. ✅ Mobile app integration
