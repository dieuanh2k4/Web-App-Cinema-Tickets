# Hệ thống Đặt vé Xem phim - CineBook

## Tính năng đã hoàn thành ✅

### 1. Giao diện Đặt vé (BookingPage.jsx)
- ✅ Hiển thị thông tin suất chiếu
- ✅ Sơ đồ ghế trực quan với màu sắc:
  - 🟢 **Xanh lá**: Ghế trống (Regular)
  - 🟣 **Tím**: Ghế VIP
  - 🩷 **Hồng**: Ghế Couple
  - 🟡 **Vàng**: Ghế đang chọn
  - 🔴 **Đỏ**: Ghế đã đặt
- ✅ Chọn/bỏ chọn ghế bằng click
- ✅ Hiển thị giá vé theo loại ghế
- ✅ Form thông tin khách hàng (tên, số điện thoại, email)
- ✅ Chọn phương thức thanh toán (VNPay, Momo, Banking)

### 2. Component SeatMap
- ✅ Tổ chức ghế theo hàng (A, B, C...)
- ✅ Hiển thị màn hình cinema
- ✅ Legend giải thích màu sắc ghế
- ✅ Hover effects và animations
- ✅ Disable ghế đã đặt

### 3. Backend Payment (VNPayService.cs)
- ✅ Tích hợp VNPay Payment Gateway
- ✅ Tạo URL thanh toán với mã hóa HMAC-SHA512
- ✅ Validate signature từ VNPay callback
- ✅ PaymentController với endpoints:
  - `POST /api/payment/vnpay/create` - Tạo link thanh toán
  - `GET /api/payment/vnpay/callback` - Nhận callback từ VNPay

### 4. Booking Flow
```
1. User chọn phim → Chọn suất chiếu
2. BookingPage: Chọn ghế ngồi
3. Điền thông tin khách hàng
4. Chọn phương thức thanh toán
5. Click "Xác nhận đặt vé"
6. Backend tạo booking (status: Pending)
7. Nếu VNPay: Redirect đến VNPay payment
8. VNPay callback → Update payment status
9. Success → BookingSuccessPage (hiển thị QR code)
10. Failed → BookingFailedPage
```

### 5. Trang Success/Failed
- ✅ **BookingSuccessPage**: Hiển thị mã vé, QR code placeholder, nút tải vé
- ✅ **BookingFailedPage**: Thông báo lỗi, gợi ý nguyên nhân, retry button

## Cấu hình VNPay

### Backend (appsettings.json)
```json
{
  "VNPay": {
    "TmnCode": "YOUR_VNPAY_TMN_CODE",
    "HashSecret": "YOUR_VNPAY_HASH_SECRET",
    "Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://localhost:5000/api/payment/vnpay/callback"
  },
  "Frontend": {
    "Url": "http://localhost:3001"
  }
}
```

**Lấy thông tin VNPay:**
1. Đăng ký tài khoản sandbox: https://sandbox.vnpayment.vn/merchantv2
2. Lấy `TmnCode` và `HashSecret` từ dashboard
3. Thay thế vào `appsettings.json`

### Frontend Routes
```javascript
/booking/:showtimeId        → BookingPage (chọn ghế)
/booking-success/:ticketId  → BookingSuccessPage
/booking-failed             → BookingFailedPage
```

## Giá vé

Hiện tại hardcoded trong frontend (có thể lấy từ backend sau):
- **Regular**: 70,000₫
- **VIP**: 100,000₫
- **Couple**: 150,000₫

## TODO - Các tính năng chưa hoàn thành

### 1. QR Code Generation 🔲
- Cài đặt package: `QRCoder` (NuGet)
- Generate QR code từ `ticketId`
- Lưu QR image vào MinIO
- Trả về URL cho frontend

### 2. Email Service 🔲
- Cấu hình SMTP (Gmail/SendGrid)
- Gửi email confirmation với:
  - Thông tin vé
  - QR code attachment
  - Link download vé PDF

### 3. Ticket PDF Generation 🔲
- Package: `iTextSharp` hoặc `PDFSharp`
- Tạo PDF với layout đẹp
- Include: Movie poster, showtime, seats, QR code

### 4. Real Seat Pricing 🔲
- Lấy giá từ `Seats.Price` trong database
- Thay thế logic hardcoded trong `calculateTotal()`

### 5. User Account Integration 🔲
- Lưu booking vào `User.Bookings`
- Trang "Vé của tôi" trong Profile
- Lịch sử đặt vé

### 6. Seat Lock Mechanism 🔲
- Lock ghế trong 5 phút khi user chọn
- Tránh 2 users đặt cùng ghế
- Auto-release nếu không thanh toán

## Database Migrations

```bash
cd Server
dotnet ef migrations add AddVNPayPayment
dotnet ef database update
```

## Run Project

### Backend
```bash
cd Server
dotnet run
```

### Frontend
```bash
cd cinebook-frontend
npm run dev
```

## API Testing

### Create Booking
```bash
curl -X POST http://localhost:5000/api/booking/create \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": 1,
    "seatIds": [1, 2, 3],
    "customerName": "Nguyen Van A",
    "phoneNumber": "0912345678",
    "email": "test@example.com",
    "paymentMethod": "VNPay"
  }'
```

### Create VNPay Payment
```bash
curl -X POST http://localhost:5000/api/payment/vnpay/create \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": 1,
    "amount": 210000,
    "orderInfo": "Thanh toan ve phim"
  }'
```

## Security Notes

⚠️ **Production Checklist:**
- [ ] Đổi `Jwt.Key` trong appsettings
- [ ] Sử dụng VNPay production URL
- [ ] Enable HTTPS
- [ ] Validate user input (XSS, SQL injection)
- [ ] Rate limiting cho API
- [ ] Log payment transactions
- [ ] Backup database định kỳ

## Support

Gặp vấn đề? Liên hệ: support@cinebook.com
