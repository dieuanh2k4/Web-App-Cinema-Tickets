# Hệ thống AI Tự động Tạo Lịch Chiếu

## Tổng quan

Hệ thống AI tự động tạo lịch chiếu phim thông minh, tối ưu hóa doanh thu và trải nghiệm khán giả.

## Tính năng AI

### 1. Thuật toán tính điểm ưu tiên (Movie Scoring)

Mỗi phim được tính điểm dựa trên:

- **Rating (40%)**: Phim có rating cao được ưu tiên
- **Độ mới (30%)**:
  - Phim mới ra mắt (≤7 ngày): +30 điểm
  - Phim trong 2 tuần: +20 điểm
  - Phim trong 1 tháng: +10 điểm
- **Thời lượng (20%)**:
  - 90-150 phút: +20 điểm (lý tưởng)
  - <90 phút: +10 điểm (dễ xếp lịch)
  - > 150 phút: +5 điểm (khó xếp)
- **Thể loại phổ biến (10%)**: Hành động, Hài, Kinh dị, Sci-Fi

### 2. Tối ưu hóa lịch chiếu

- **Tự động phân bổ**: AI phân bổ phim vào các phòng chiếu
- **Cân bằng thể loại**: Không quá nhiều phim cùng thể loại trong 1 ngày
- **Tối đa hóa suất chiếu**: Sử dụng tối đa thời gian hoạt động rạp (8h-23h)
- **Thời gian dọn dẹp**: 15 phút giữa các suất

### 3. Linh hoạt theo thời gian thực

- Lịch chiếu thay đổi tự động theo:
  - Phim mới ra mắt
  - Rating của phim
  - Ngày trong tuần
  - Sức chứa phòng chiếu

## API Endpoints

### 1. Tạo lịch cho 1 ngày

```
POST /api/showtimes/auto-generate?date=2025-12-25
```

### 2. Tạo lịch cho nhiều ngày

```
POST /api/showtimes/auto-generate-range?startDate=2025-12-25&endDate=2025-12-31
```

### 3. Xem thống kê

```
GET /api/showtimes/statistics?date=2025-12-25
```

## Cách sử dụng

### Backend (C#)

1. Service đã tự động inject vào ShowtimesController
2. Gọi API để tạo lịch:

```bash
curl -X POST "http://localhost:5000/api/showtimes/auto-generate?date=2025-12-25"
```

### Frontend (React)

1. Truy cập trang Lịch chiếu: `/showtimes`
2. Click nút "Tự động tạo lịch"
3. Hệ thống sẽ:
   - Xóa lịch cũ (nếu có)
   - Phân tích phim đang chiếu
   - Tính điểm ưu tiên
   - Tạo lịch tối ưu
   - Hiển thị kết quả

## Quy tắc AI

### Phân bổ phim vào phòng:

1. Phòng lớn → Phim có rating cao
2. Phòng nhỏ → Phim thể loại niche
3. Suất prime time (18h-22h) → Phim hot nhất

### Cân bằng lịch chiếu:

- Không quá 3 phim cùng thể loại/ngày
- Ưu tiên phim mới ra mắt
- Phân bổ đều các thể loại trong tuần

### Tối ưu doanh thu:

- Phim rating cao → Nhiều suất chiếu hơn
- Phòng lớn → Phim phổ biến
- Tránh lãng phí thời gian (tối đa suất chiếu)

## Ví dụ Output

```json
{
  "isSuccess": true,
  "message": "Đã tạo 24 suất chiếu cho ngày 25/12/2025",
  "data": [
    {
      "movieId": 1,
      "roomId": 1,
      "date": "2025-12-25",
      "start": "08:00",
      "end": "10:30"
    },
    ...
  ]
}
```

## Thống kê

```json
{
  "date": "2025-12-25",
  "totalShowtimes": 24,
  "totalMovies": 6,
  "totalRooms": 4,
  "movieDistribution": [
    {
      "movieTitle": "Avengers: Endgame",
      "showtimeCount": 5,
      "totalMinutes": 900
    },
    ...
  ]
}
```

## Lưu ý

- Chỉ tạo lịch cho phim đang trong thời gian chiếu (StartDate ≤ date ≤ EndDate)
- Tự động xóa lịch cũ khi tạo lịch mới
- Có thể chạy tự động hàng ngày (cron job)
- API có thể gọi từ admin panel hoặc scheduled task

## Tùy chỉnh

Có thể điều chỉnh trong `AutoShowtimeService.cs`:

- `CLEANUP_TIME`: Thời gian dọn dẹp (mặc định 15 phút)
- `OPENING_HOUR`: Giờ mở cửa (mặc định 8h)
- `CLOSING_HOUR`: Giờ đóng cửa (mặc định 23h)
- Trọng số tính điểm phim
- Logic cân bằng thể loại
