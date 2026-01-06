# 🎬 CineBook Frontend - Setup & Configuration Guide

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn
- Backend API server đang chạy

## 🚀 Cài đặt

### 1. Cài đặt dependencies
```bash
cd cinebook-frontend
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục root:
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=CineBook
VITE_APP_VERSION=1.0.0
```

**Lưu ý**: Thay đổi `VITE_API_URL` cho phù hợp với server của bạn:
- Development: `http://localhost:5001/api`
- Production: `https://your-domain.com/api`

### 3. Chạy development server
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 🔗 Kết nối với Backend

### API Endpoints đã kết nối

#### **Authentication**
- `POST /Auth/login` - Đăng nhập
- `POST /Auth/customer-register` - Đăng ký (FormData)
- `GET /Auth/me` - Lấy thông tin user hiện tại
- `POST /Auth/forgot-password` - Quên mật khẩu
- `POST /Auth/verify-otp` - Xác thực OTP
- `POST /Auth/reset-password` - Reset mật khẩu

#### **Movies**
- `GET /Movies/get-all-movies` - Danh sách phim
- `GET /Movies/get-movie-by-id/{id}` - Chi tiết phim
- `GET /Search/search-movie-by-name?q={query}` - Tìm kiếm phim

#### **Theaters**
- `GET /Theater/get-all-theater` - Danh sách rạp
- `GET /Theater/get-theater-by-city?city={city}` - Rạp theo thành phố

#### **Showtimes**
- `GET /Showtimes/get_all_showtime` - Tất cả suất chiếu
- `GET /Showtimes/get-showtime-by-movieId` - Suất chiếu theo phim
- `GET /Showtimes/get-showtime-by-theaterid` - Suất chiếu theo rạp
- `POST /Showtimes/auto-generate` - AI tạo lịch tự động
- `GET /Showtimes/statistics` - Thống kê

#### **Seats**
- `GET /Seats/showtime/{showtimeId}` - Ghế theo suất chiếu
- `POST /Seats/check-availability` - Kiểm tra ghế khả dụng

#### **Booking - 2-Step Flow** ⭐
1. **Hold Seats** (Bước 1)
   - `POST /Booking/hold-seats` - Giữ ghế 10 phút trong Redis
   - Request: `{ ShowtimeId, SeatIds }`
   - Response: `{ holdId, expiresAt, ttlSeconds }`

2. **Confirm Booking** (Bước 2)
   - `POST /Booking/confirm-booking` - Xác nhận đặt vé
   - Request: `{ holdId }`
   - Response: `{ booking: { ticketId, bookingCode } }`

- `GET /Booking/available-seats/{showtimeId}` - Ghế khả dụng

#### **Payment**
- `POST /Payment/vnpay/create` - Tạo link thanh toán VNPay
- `GET /Payment/vnpay/callback` - Callback VNPay

#### **Tickets**
- `GET /Ticket/{ticketId}` - Chi tiết vé

#### **Chat AI**
- `POST /Chat/send-message` - Gửi tin nhắn tới CineBot AI

#### **User/Customer**
- `GET /Customer/profile` - Thông tin customer
- `PUT /Customer/update-profile` - Cập nhật profile
- `GET /Customer/my-tickets` - Lịch sử vé của tôi

## 🎯 Các tính năng chính

### 1. Authentication Flow
- ✅ Login với JWT token
- ✅ Register với FormData (hỗ trợ upload avatar)
- ✅ Forgot Password (3-step: OTP → Verify → Reset)
- ✅ Protected Routes với ProtectedRoute component
- ✅ Auto-redirect sau login về trang trước đó

### 2. Movie Features
- ✅ Danh sách phim (Đang chiếu, Sắp chiếu)
- ✅ Chi tiết phim với trailer YouTube
- ✅ Lọc theo thể loại, rating
- ✅ Smart search với suggestions (tìm theo tên, thể loại, đạo diễn, diễn viên)

### 3. Booking System - 2-Step Flow ⭐
**Flow hoạt động**:
```
1. User chọn ghế
   ↓
2. Frontend tự động hold seats (POST /Booking/hold-seats)
   → Server giữ ghế trong Redis 10 phút
   → Trả về holdId
   ↓
3. User nhập thông tin & chọn thanh toán
   ↓
4. Frontend confirm booking (POST /Booking/confirm-booking)
   → Server tạo ticket trong database
   ↓
5. Redirect tới VNPay nếu chọn VNPay
   hoặc Success page nếu thanh toán khác
```

**Tính năng**:
- ✅ Real-time seat availability (auto-refresh 30s)
- ✅ Countdown timer 10 phút
- ✅ Visual seat map (VIP, Thường, Đã đặt, Đang chọn)
- ✅ Automatic seat hold on selection
- ✅ Price calculation (VIP: 100,000₫, Thường: 70,000₫)
- ✅ Multiple payment methods (VNPay, Momo, Banking)

### 4. Showtimes
- ✅ Lọc theo rạp & ngày
- ✅ Hiển thị nhóm theo phim
- ✅ Quick booking buttons

### 5. Profile & History
- ✅ Xem thông tin cá nhân
- ✅ Lịch sử đặt vé
- ✅ Quản lý vé (Tất cả, Đã thanh toán, Đã hủy)

### 6. AI Chatbot
- ✅ Floating chat button
- ✅ Real-time chat với CineBot
- ✅ Quick actions (Phim đang chiếu, Giá vé, Rạp chiếu)
- ✅ Smart suggestions từ bot

## 🔧 Cấu trúc Project

```
src/
├── components/           # Reusable components
│   ├── Header.jsx       # Navigation + Smart Search
│   ├── ChatBot.jsx      # AI Assistant
│   ├── SeatMap.jsx      # Visual seat selection
│   ├── Layout.jsx       # App wrapper
│   └── ...
├── pages/               # Route pages
│   ├── HomePage.jsx     # Landing page
│   ├── LoginPage.jsx    # Login form
│   ├── RegisterPage.jsx # Register form
│   ├── BookingPage.jsx  # 2-step booking ⭐
│   ├── MovieDetailPage.jsx
│   ├── ShowtimesPage.jsx
│   ├── ProfilePage.jsx
│   └── ...
├── services/
│   └── api.js          # API service layer với Axios
├── store/
│   └── authStore.js    # Zustand state management
└── App.jsx             # Routes configuration
```

## 🎨 UI/UX Features

- ✅ Dark theme với gradient effects
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Smooth animations với Framer Motion
- ✅ Toast notifications với React Hot Toast
- ✅ Loading states & skeletons
- ✅ Error handling UI

## 🐛 Debugging

### Check API Connection
1. Mở Console trong browser (F12)
2. Kiểm tra log: `🔗 API Base URL: http://localhost:5001/api`
3. Xem Network tab để debug API calls

### Common Issues

**1. CORS Error**
- Kiểm tra backend có enable CORS chưa
- Server phải cho phép origin của frontend

**2. 401 Unauthorized**
- Token hết hạn → Logout & login lại
- Token không được gửi → Check axios interceptor

**3. Booking Flow Error**
- Đảm bảo backend Redis đang chạy
- Kiểm tra holdId có được trả về không
- Timeout 10 phút → Chọn ghế lại

**4. API Not Found (404)**
- Kiểm tra `VITE_API_URL` trong `.env`
- Restart dev server sau khi sửa `.env`

## 📦 Build Production

```bash
npm run build
```

Output trong folder `dist/`

### Deploy
```bash
# Preview production build
npm run preview

# Deploy to hosting (Vercel, Netlify, etc.)
# Đảm bảo set environment variables
```

## 🔐 Security Notes

- JWT token lưu trong localStorage & Zustand store
- Axios interceptor tự động thêm Authorization header
- Protected routes redirect về login nếu chưa authenticate
- FormData validation trên cả client & server

## 📞 API Rate Limiting

- Seat availability: Refresh mỗi 30s
- Movies list: Cache 5 phút
- User profile: Cache 5 phút
- Search: Instant (no cache)

## ⚡ Performance Optimization

- React Query cho caching & auto-refetch
- Code splitting với React lazy (if needed)
- Image optimization
- Debounce cho search & seat selection

## 🎯 Future Enhancements

- [ ] Avatar upload trong Register
- [ ] Edit profile functionality
- [ ] Ticket history filters
- [ ] Seat preferences (save favorite seats)
- [ ] Notifications system
- [ ] Multi-language support

---

**Version**: 1.0.0  
**Last Updated**: January 6, 2026  
**Author**: CineBook Development Team
