# 🧪 TEST SCENARIOS - Redis Seat Reservation System

> **Ngày tạo:** 23/12/2025  
> **Hệ thống:** Redis + ASP.NET Core + PostgreSQL  
> **Phase:** MVP Testing

---

## 📋 I. PREREQUISITES

### **1. Kiểm tra môi trường**

- [ ] Docker Desktop đã khởi động
- [ ] Redis container đang chạy (port 6379)
- [ ] PostgreSQL database (Supabase) connected
- [ ] ASP.NET Core app đang chạy (port 7051/5051)

**Verify commands:**
```bash
# Check Docker
docker ps | Select-String redis

# Check API
curl https://localhost:7051/api/RedisTest/ping
```

---

## 🎯 II. TEST CASES - REDIS BASIC

### **TEST 1: Ping Redis Connection**

**Endpoint:** `GET /api/RedisTest/ping`

**Expected Response:**
```json
{
  "success": true,
  "message": "Redis connected successfully!",
  "connection": {
    "endpoints": ["localhost:6379"],
    "isConnected": true
  },
  "test": {
    "key": "test:ping",
    "writtenValue": "Hello Redis at 2025-12-23 10:00:00",
    "retrievedValue": "Hello Redis at 2025-12-23 10:00:00",
    "expiresIn": "30 seconds"
  }
}
```

**Status:** ✅ PASS / ❌ FAIL

---

## 🎫 III. TEST CASES - SEAT HOLD WORKFLOW

### **TEST 2: Hold 1 ghế thành công**

**Endpoint:** `POST /api/RedisTest/hold-seat`

**Request:**
```json
{
  "showtimeId": 1,
  "seatIds": [1],
  "sessionId": "user-abc-123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã giữ 1 ghế thành công!",
  "holdId": "guid-xyz",
  "sessionId": "user-abc-123",
  "showtimeId": 1,
  "seatIds": [1],
  "expiresAt": "2025-12-23T10:10:00",
  "ttlSeconds": 600
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] `holdId` được trả về
- [ ] `ttlSeconds` = 600 (10 phút)
- [ ] `expiresAt` = hiện tại + 10 phút

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 3: Hold nhiều ghế cùng lúc**

**Endpoint:** `POST /api/RedisTest/hold-seat`

**Request:**
```json
{
  "showtimeId": 1,
  "seatIds": [2, 3, 4],
  "sessionId": "user-def-456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã giữ 3 ghế thành công!",
  "showtimeId": 1,
  "seatIds": [2, 3, 4],
  "ttlSeconds": 600
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] Tất cả 3 ghế được hold
- [ ] TTL 10 phút cho cả 3 ghế

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 4: Check trạng thái ghế đã hold**

**Endpoint:** `GET /api/RedisTest/check-seat/1/1`

**Expected Response:**
```json
{
  "isHeld": true,
  "message": "Ghế đang được giữ",
  "holdBy": "guid-xyz",
  "remainingSeconds": 580,
  "expiresAt": "2025-12-23T10:10:00"
}
```

**Verify:**
- [ ] `isHeld` = true
- [ ] `remainingSeconds` giảm dần
- [ ] `holdBy` match với holdId từ TEST 2

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 5: Check ghế chưa hold**

**Endpoint:** `GET /api/RedisTest/check-seat/1/99`

**Expected Response:**
```json
{
  "isHeld": false,
  "message": "Ghế đang trống, có thể đặt"
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] `isHeld` = false

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 6: User khác cố hold ghế đã bị giữ (RACE CONDITION TEST)**

**Endpoint:** `POST /api/RedisTest/hold-seat`

**Request:**
```json
{
  "showtimeId": 1,
  "seatIds": [1],
  "sessionId": "other-user-xyz"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Các ghế sau đã được giữ: 1",
  "alreadyHeldSeats": [1]
}
```

**Verify:**
- [ ] Response 400 Bad Request
- [ ] Message báo ghế đã được giữ
- [ ] `alreadyHeldSeats` chứa [1]

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 7: Cùng user hold lại ghế của mình (IDEMPOTENT)**

**Endpoint:** `POST /api/RedisTest/hold-seat`

**Request:**
```json
{
  "showtimeId": 1,
  "seatIds": [1],
  "sessionId": "user-abc-123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đã giữ 1 ghế thành công!",
  "sessionId": "user-abc-123"
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] TTL được refresh về 10 phút

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 8: Release ghế thủ công**

**Endpoint:** `DELETE /api/RedisTest/release-seat/1/1?sessionId=user-abc-123`

**Expected Response:**
```json
{
  "success": true,
  "message": "Ghế đã được giải phóng"
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] Redis key bị xóa
- [ ] Check lại ghế → `isHeld` = false

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 9: User khác cố release ghế không phải của mình**

**Endpoint:** `DELETE /api/RedisTest/release-seat/1/2?sessionId=wrong-user-xyz`

**Expected Response:**
```json
{
  "success": false,
  "message": "Bạn không có quyền release ghế này",
  "holdBy": "user-def-456"
}
```

**Verify:**
- [ ] Response 400 Bad Request
- [ ] Ghế vẫn còn hold (không bị xóa)

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 10: Xem tất cả ghế đang hold cho 1 suất chiếu**

**Endpoint:** `GET /api/RedisTest/held-seats/1`

**Expected Response:**
```json
{
  "showtimeId": 1,
  "totalHeldSeats": 3,
  "seats": [
    {
      "seatId": "2",
      "holdBy": "guid-abc",
      "remainingSeconds": 550
    },
    {
      "seatId": "3",
      "holdBy": "guid-abc",
      "remainingSeconds": 550
    },
    {
      "seatId": "4",
      "holdBy": "guid-abc",
      "remainingSeconds": 550
    }
  ]
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] `totalHeldSeats` match với số ghế thực tế
- [ ] TTL đang countdown

**Status:** ✅ PASS / ❌ FAIL

---

## 🎟️ IV. TEST CASES - BOOKING CONFIRMATION

### **TEST 11: Confirm booking với ghế đã hold**

**Bước 1: Hold ghế**
```json
POST /api/RedisTest/hold-seat
{
  "showtimeId": 1,
  "seatIds": [10, 11],
  "sessionId": "confirm-test-user"
}
```

**Bước 2: Confirm booking**
```json
POST /api/Booking/confirm-booking
{
  "holdId": "seat_hold:1:10",
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0123456789",
  "customerEmail": "test@gmail.com"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Đặt vé thành công!",
  "booking": {
    "ticketId": 1,
    "bookingCode": "00000001"
  },
  "holdId": "seat_hold:1:10",
  "releasedSeats": 2
}
```

**Verify:**
- [ ] Response 200 OK
- [ ] Ticket được tạo trong DB
- [ ] StatusSeat = "Booked"
- [ ] Redis keys bị xóa (check lại → `isHeld` = false)

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 12: Confirm booking với holdId đã expire**

**Bước 1: Hold ghế**

**Bước 2: Đợi 10 phút (hoặc delete key thủ công)**
```bash
docker exec -it redis-cinebook redis-cli
DEL seat_hold:1:20
```

**Bước 3: Confirm booking**
```json
POST /api/Booking/confirm-booking
{
  "holdId": "seat_hold:1:20",
  "customerName": "Test User",
  "customerPhone": "0987654321"
}
```

**Expected Response:**
```json
{
  "message": "Hold không tồn tại hoặc đã hết hạn. Vui lòng chọn lại ghế."
}
```

**Verify:**
- [ ] Response 400 Bad Request
- [ ] Không tạo Ticket trong DB

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 13: Confirm booking với ghế đã được book bởi người khác**

**Scenario:**
1. User A hold ghế 30
2. User B cũng hold ghế 30 (bị reject)
3. User A confirm → tạo vé thành công
4. User B cố confirm (sau khi A đã confirm) → bị reject

**Expected:** User B không thể confirm vì ghế đã booked

**Status:** ✅ PASS / ❌ FAIL

---

## ⏱️ V. TEST CASES - TTL & EXPIRATION

### **TEST 14: TTL tự động expire sau 10 phút**

**Bước 1: Hold ghế với TTL ngắn (test nhanh)**
Sửa `appsettings.json`:
```json
"SeatHoldTTLMinutes": 0.5
```
Restart app.

**Bước 2: Hold ghế**
```json
POST /api/RedisTest/hold-seat
{
  "showtimeId": 2,
  "seatIds": [50],
  "sessionId": "ttl-test"
}
```

**Bước 3: Đợi 30 giây**

**Bước 4: Check ghế**
```
GET /api/RedisTest/check-seat/2/50
```

**Expected Response:**
```json
{
  "isHeld": false,
  "message": "Ghế đang trống, có thể đặt"
}
```

**Verify:**
- [ ] Redis tự động xóa key sau 30 giây
- [ ] Ghế available trở lại

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 15: Background Job Cleanup (DISABLED)**

**Check Hangfire Dashboard:**
```
http://localhost:5051/hangfire
```

**Verify:**
- [ ] Dashboard accessible
- [ ] Recurring job `check-expiring-seat-holds` hiển thị
- [ ] Job không chạy (disabled)
- [ ] Logs không có timeout errors

**Status:** ✅ PASS / ❌ FAIL

---

## 🔥 VI. STRESS TEST (Optional)

### **TEST 16: Concurrent requests (10 users cùng book 1 ghế)**

**Tool:** JMeter / Postman Runner / k6

**Scenario:**
- 10 concurrent requests cùng hold ghế 1
- Chỉ 1 request được thành công
- 9 requests còn lại bị reject

**Expected:**
- [ ] Không có race condition
- [ ] Chỉ 1 holdId được tạo
- [ ] Redis đảm bảo atomicity

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 17: Load test - 100 holds/giây**

**Tool:** k6 / Artillery

**Expected:**
- [ ] Redis response < 50ms
- [ ] API response < 200ms
- [ ] Không có timeout

**Status:** ✅ PASS / ❌ FAIL

---

## 📊 VII. DATABASE VERIFICATION

### **TEST 18: Check Ticket trong PostgreSQL**

**Query:**
```sql
SELECT * FROM "Ticket" ORDER BY "Id" DESC LIMIT 5;
```

**Verify:**
- [ ] Ticket có CustomerId
- [ ] TotalPrice đúng
- [ ] Date = today

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 19: Check StatusSeat**

**Query:**
```sql
SELECT * FROM "StatusSeat" WHERE "Status" = 'Booked' ORDER BY "Id" DESC;
```

**Verify:**
- [ ] StatusSeat có SeatId, ShowtimeId
- [ ] Status = "Booked"

**Status:** ✅ PASS / ❌ FAIL

---

## 🐛 VIII. ERROR HANDLING

### **TEST 20: Invalid showtimeId**

**Request:**
```json
{
  "showtimeId": 9999,
  "seatIds": [1],
  "sessionId": "test"
}
```

**Expected:** 200 OK (Redis không validate business logic)

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 21: Empty seatIds array**

**Request:**
```json
{
  "showtimeId": 1,
  "seatIds": [],
  "sessionId": "test"
}
```

**Expected:** 400 Bad Request hoặc hold 0 ghế

**Status:** ✅ PASS / ❌ FAIL

---

### **TEST 22: Redis connection down**

**Scenario:**
1. Stop Redis: `docker stop redis-cinebook`
2. Call API

**Expected:**
- [ ] Response 500 Internal Server Error
- [ ] Error message: "Redis connection failed"

**Status:** ✅ PASS / ❌ FAIL

---

## 📝 IX. SUMMARY CHECKLIST

### **Phase 1: MVP - MUST HAVE**
- [ ] TEST 1: Redis ping
- [ ] TEST 2: Hold 1 ghế
- [ ] TEST 3: Hold nhiều ghế
- [ ] TEST 4: Check ghế hold
- [ ] TEST 6: Race condition prevention
- [ ] TEST 8: Release ghế
- [ ] TEST 11: Confirm booking
- [ ] TEST 14: TTL auto expire

### **Phase 2: Enhancement - NICE TO HAVE**
- [ ] TEST 7: Idempotent hold
- [ ] TEST 9: Unauthorized release
- [ ] TEST 10: List all held seats
- [ ] TEST 12: Expired hold
- [ ] TEST 13: Double booking prevention

### **Phase 3: Stress Test - OPTIONAL**
- [ ] TEST 16: Concurrent requests
- [ ] TEST 17: Load test

---

## 🚀 X. QUICK TEST COMMANDS

### **Swagger UI:**
```
https://localhost:7051/swagger
```

### **Hangfire Dashboard:**
```
http://localhost:5051/hangfire
```

### **Redis CLI:**
```bash
docker exec -it redis-cinebook redis-cli

# Xem tất cả keys
KEYS *

# Xem TTL
TTL seat_hold:1:1

# Xem giá trị
GET seat_hold:1:1

# Xóa key
DEL seat_hold:1:1
```

### **PostgreSQL (Supabase):**
```
https://supabase.com/dashboard
```

---

**Người test:** _________________  
**Ngày test:** _________________  
**Kết quả:** _____ / 22 tests passed  
**Ghi chú:** _____________________

---

**Version:** 1.0  
**Last Updated:** 23/12/2025
