# Hướng dẫn cài đặt Authentication

## Cài đặt AsyncStorage

Để sử dụng tính năng authentication, bạn cần cài đặt AsyncStorage:

```bash
npm install @react-native-async-storage/async-storage
```

## Các tính năng đã được thêm:

### 1. Validation cho trang Login

- Email phải có định dạng @example.com
- Mật khẩu phải có trên 6 ký tự
- Hiển thị lỗi validation real-time

### 2. Trang Account với nút Logout

- Giao diện đẹp với avatar, thông tin user
- Menu các chức năng (Thông tin cá nhân, Lịch sử đặt vé, Cài đặt, Hỗ trợ)
- Nút logout với xác nhận
- Tự động load thông tin user từ AsyncStorage

### 3. AuthService

- Quản lý token và thông tin user
- Lưu trữ persistent với AsyncStorage
- Hàm login, logout, kiểm tra trạng thái đăng nhập

## Cách sử dụng:

1. Cài đặt AsyncStorage: `npm install @react-native-async-storage/async-storage`
2. Chạy ứng dụng: `npm start`
3. Đăng nhập với email có định dạng @example.com và mật khẩu trên 6 ký tự
4. Vào tab Account để xem thông tin và đăng xuất

## Các tính năng có thể thêm:

1. **Remember Me**: Lưu trạng thái đăng nhập
2. **Biometric Authentication**: Đăng nhập bằng vân tay/face ID
3. **Social Login**: Đăng nhập bằng Google/Facebook
4. **Two-Factor Authentication**: Xác thực 2 bước
5. **Password Reset**: Quên mật khẩu
6. **Session Management**: Quản lý phiên đăng nhập
7. **Role-based Access**: Phân quyền người dùng
8. **Profile Management**: Chỉnh sửa thông tin cá nhân

