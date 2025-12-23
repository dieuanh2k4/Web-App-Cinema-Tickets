# 🎬 CINEBOOK FRONTEND - HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

## 📋 Yêu cầu hệ thống
- Node.js >= 18.x
- npm hoặc yarn

## 🚀 BƯỚC 1: Cài đặt dependencies

```bash
cd cinebook-frontend
npm install
```

## ⚙️ BƯỚC 2: Cấu hình môi trường

File `.env` đã được tạo sẵn với cấu hình:
```
VITE_API_URL=http://localhost:5000/api
```

Nếu backend của bạn chạy ở port khác, hãy cập nhật lại URL.

## 🎯 BƯỚC 3: Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 📦 Các lệnh khác

```bash
# Build production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Tính năng đã hoàn thiện

✅ **Giao diện trang chủ (Home Page)**
- Hero Banner với Swiper carousel
- Movie cards với hover effects
- Responsive design (mobile, tablet, desktop)
- Dark theme với màu đỏ accent (#DC2626)

✅ **Header Navigation**
- Logo Cinebook
- Menu điều hướng: Trang chủ, Lịch chiếu, Đặt vé, Vé chúng tôi, Dịch vụ & Tiện ích
- Search bar
- Đăng ký / Đăng nhập buttons
- Mobile responsive menu

✅ **Footer**
- Thông tin liên hệ
- Quick links
- Social media icons

✅ **Authentication**
- Login page với form validation
- Token-based authentication
- Protected routes

✅ **API Integration**
- Axios client với interceptors
- React Query cho data fetching & caching
- Zustand cho global state management

## 🎨 Design System

### Màu sắc (giống trong ảnh)
- **Primary Red**: `#DC2626` - Nút CTA, hover effects
- **Dark Background**: `#0F0F0F` - Background chính
- **Dark Lighter**: `#1A1A1A` - Cards, sections
- **Gray Custom**: `#3A3A3A` - Borders, dividers

### Typography
- Font: Inter (Google Fonts)
- Weights: 300, 400, 500, 600, 700, 800

### Components
- Buttons: Primary (red), Secondary (outline)
- Cards: Movie cards với hover effects
- Carousel: Swiper cho banner và movie lists
- Forms: React Hook Form với validation

## 🔌 API Endpoints (đã tích hợp)

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me

// Movies
GET  /api/movies/get-all-movies
GET  /api/movies/get-movie-by-id/:id
GET  /api/movies/search?q=keyword

// Theaters
GET  /api/theater/get-all-theater
GET  /api/theater/get-theater-by-city?city=

// Showtimes
GET  /api/showtimes/get_all_showtime
GET  /api/showtimes/get-showtime-by-movieId

// Seats
GET  /api/seats/showtime/:showtimeId
POST /api/seats/check-availability

// Booking
POST /api/booking/create
GET  /api/booking/available-seats/:showtimeId
```

## 📁 Cấu trúc thư mục

```
cinebook-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── HeroBanner.jsx
│   │   └── MovieCarousel.jsx
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── MoviesPage.jsx
│   │   ├── MovieDetailPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── store/           # Zustand stores
│   │   └── authStore.js
│   ├── App.jsx          # Main App with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles (Tailwind)
├── .env                 # Environment variables
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Các trang cần hoàn thiện tiếp

1. **MoviesPage** - Danh sách phim với filter/search
2. **MovieDetailPage** - Chi tiết phim, trailer, showtimes
3. **BookingPage** - Chọn ghế, thanh toán
4. **RegisterPage** - Đăng ký tài khoản
5. **ProfilePage** - Quản lý tài khoản
6. **TicketsPage** - Lịch sử vé đã đặt

## 🔧 Troubleshooting

### Lỗi CORS
Nếu gặp lỗi CORS khi call API, đảm bảo backend đã config CORS cho phép origin `http://localhost:3000`

### Lỗi không load được data
Kiểm tra:
1. Backend đang chạy ở `http://localhost:5000`
2. File `.env` có đúng URL chưa
3. Mở DevTools > Network để xem API response

### Lỗi Tailwind không hoạt động
```bash
npm run dev -- --force
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, liên hệ team dev hoặc tạo issue trong repository.

## 🎉 Kết quả

Sau khi chạy `npm run dev`, bạn sẽ thấy giao diện trang chủ giống như trong ảnh tham khảo:
- Banner carousel với phim nổi bật
- Movie cards với hover effects
- Navigation menu responsive
- Dark theme chuyên nghiệp

---

**Happy Coding! 🚀**
