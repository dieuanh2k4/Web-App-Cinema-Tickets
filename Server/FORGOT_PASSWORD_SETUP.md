# Hướng dẫn cấu hình Email cho tính năng Quên Mật Khẩu

## Bước 1: Thêm cấu hình Email vào appsettings.json

Mở file `Server/appsettings.json` và thêm section Email:

```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "FromEmail": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}
```

## Bước 2: Tạo App Password cho Gmail (nếu dùng Gmail)

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập tài khoản Gmail của bạn
3. Tạo App Password mới cho ứng dụng
4. Copy mật khẩu 16 ký tự và paste vào `Password` trong appsettings.json

## Bước 3: Tạo Migration cho OTPCodes

Chạy lệnh sau trong terminal tại thư mục Server:

```bash
dotnet ef migrations add AddOTPCode
dotnet ef database update
```

## Bước 4: Test chức năng

### Đăng ký:
- POST `/api/auth/register`
- Body: `{ "username": "testuser", "email": "test@gmail.com", "password": "123456" }`

### Quên mật khẩu:
1. POST `/api/auth/forgot-password` - Body: `{ "email": "test@gmail.com" }`
2. Kiểm tra email để lấy mã OTP
3. POST `/api/auth/verify-otp` - Body: `{ "email": "test@gmail.com", "otp": "123456" }`
4. POST `/api/auth/reset-password` - Body: `{ "email": "test@gmail.com", "otp": "123456", "newPassword": "newpass123" }`

## Lưu ý

- OTP có hiệu lực 5 phút
- Mỗi OTP chỉ sử dụng được 1 lần
- Trong môi trường development, nếu email không gửi được, OTP sẽ in ra console để test
