# Hướng dẫn Migration cho Trailer Field

## Bước 1: Tạo Migration

Chạy lệnh sau trong thư mục Server:

```bash
cd Server
dotnet ef migrations add AddTrailerToMovies
dotnet ef database update
```

## Bước 2: Thêm dữ liệu Trailer mẫu (Optional)

Có thể update database trực tiếp hoặc thêm qua API:

```sql
UPDATE "Movies" 
SET "Trailer" = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE "Id" = 1;
```

## Bước 3: Test Frontend

1. Khởi động backend:
```bash
cd Server
dotnet run
```

2. Khởi động frontend:
```bash
cd cinebook-frontend
npm run dev
```

3. Test các tính năng:
   - Truy cập http://localhost:3001/movies
   - Tìm kiếm phim theo tên, thể loại
   - Filter theo trạng thái
   - Click vào phim để xem chi tiết
   - Xem trailer (nếu có YouTube URL)
   - Chọn rạp và ngày để xem lịch chiếu
   - Click vào giờ chiếu để đặt vé

## Lưu ý

- Trailer phải là YouTube URL (format: https://www.youtube.com/watch?v=VIDEO_ID hoặc https://youtu.be/VIDEO_ID)
- Lịch chiếu hiển thị theo rạp và ngày đã chọn
- Cần có dữ liệu Showtimes trong database để hiển thị lịch chiếu
