using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Models;

namespace Server.src.Services.Implements
{
    public class AutoShowtimeService
    {
        private readonly ApplicationDbContext _context;
        private const int CLEANUP_TIME = 15; // Thời gian dọn dẹp giữa các suất (phút)
        private const int OPENING_HOUR = 8; // Giờ mở cửa
        private const int CLOSING_HOUR = 23; // Giờ đóng cửa

        public AutoShowtimeService(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Tự động tạo lịch chiếu cho nhiều ngày
        /// </summary>
        public async Task<List<Showtimes>> GenerateShowtimesForDateRange(DateOnly startDate, DateOnly endDate)
        {
            var allGeneratedShowtimes = new List<Showtimes>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var showtimes = await GenerateShowtimesForDate(date);
                allGeneratedShowtimes.AddRange(showtimes);
            }

            return allGeneratedShowtimes;
        }

        /// <summary>
        /// Tạo lịch chiếu tự động cho 1 ngày
        /// AI sắp xếp dựa trên: thời lượng phim, độ ưu tiên, số phòng, tối ưu doanh thu
        /// </summary>
        public async Task<List<Showtimes>> GenerateShowtimesForDate(DateOnly date)
        {
            // Lấy tất cả phim đang chiếu
            var movies = await _context.Movies
                .Where(m => m.StartDate.Date <= date.ToDateTime(TimeOnly.MinValue) 
                         && m.EndDate.Date >= date.ToDateTime(TimeOnly.MinValue))
                .OrderByDescending(m => m.Rating) // Ưu tiên phim có rating cao
                .ToListAsync();

            if (movies.Count == 0)
                return new List<Showtimes>();

            // Lấy tất cả phòng chiếu
            var rooms = await _context.Rooms
                .Include(r => r.Theater)
                .Where(r => r.Status == "Trống" || r.Status == "Hoạt động" || r.Status == "Available" || r.Status == "Đang hoạt động")
                .OrderByDescending(r => r.Capacity) // Ưu tiên phòng lớn
                .ToListAsync();

            if (rooms.Count == 0)
                return new List<Showtimes>();

            // Xóa lịch chiếu cũ (nếu có)
            var existingShowtimes = await _context.Showtimes
                .Where(s => s.Date == date)
                .ToListAsync();
            
            if (existingShowtimes.Any())
            {
                _context.Showtimes.RemoveRange(existingShowtimes);
                await _context.SaveChangesAsync();
            }

            var generatedShowtimes = new List<Showtimes>();

            // AI Logic: Phân bổ phim vào phòng với thời gian bắt đầu offset
            // Mỗi phòng bắt đầu khác nhau để tạo đa dạng khung giờ
            var roomIndex = 0;
            foreach (var room in rooms)
            {
                // Offset 30 phút cho mỗi phòng (0, 30, 60 phút)
                var startTimeOffset = (roomIndex % 3) * 30;
                var roomShowtimes = GenerateShowtimesForRoom(room, movies, date, startTimeOffset);
                generatedShowtimes.AddRange(roomShowtimes);
                roomIndex++;
            }

            // Lưu vào database
            await _context.Showtimes.AddRangeAsync(generatedShowtimes);
            await _context.SaveChangesAsync();

            return generatedShowtimes;
        }

        /// <summary>
        /// Tạo lịch chiếu cho 1 phòng trong 1 ngày
        /// Mỗi phòng sẽ chiếu nhiều phim khác nhau trong ngày, xen kẽ để tối ưu
        /// </summary>
        private List<Showtimes> GenerateShowtimesForRoom(Rooms room, List<Movies> movies, DateOnly date, int startTimeOffsetMinutes = 0)
        {
            var showtimes = new List<Showtimes>();
            var currentTime = new TimeOnly(OPENING_HOUR, 0).AddMinutes(startTimeOffsetMinutes);
            var closingTime = new TimeOnly(CLOSING_HOUR, 0);

            // AI Decision: Phân bổ phim dựa trên độ phổ biến và thời lượng
            var movieSchedule = OptimizeMovieSchedule(movies, room.Capacity);

            // Xen kẽ phim để tạo đa dạng (phim A -> phim B -> phim C -> phim A...)
            var movieIndex = 0;
            var movieShowCount = new Dictionary<int, int>(); // Đếm số lần chiếu mỗi phim

            while (currentTime.AddMinutes(90) <= closingTime) // Còn đủ thời gian cho phim ngắn nhất
            {
                // Chọn phim theo vòng lặp
                if (movieIndex >= movieSchedule.Count)
                    movieIndex = 0;

                var movie = movieSchedule[movieIndex];
                var movieDuration = movie.Duration;
                var endTime = currentTime.AddMinutes(movieDuration);

                // Kiểm tra có đủ thời gian chiếu không
                if (endTime.AddMinutes(CLEANUP_TIME) > closingTime)
                {
                    // Thử phim ngắn hơn
                    movieIndex++;
                    if (movieIndex >= movieSchedule.Count)
                        break; // Hết phim
                    continue;
                }

                // Giới hạn mỗi phim tối đa 3-4 suất/ngày ở 1 phòng
                var currentCount = movieShowCount.GetValueOrDefault(movie.Id, 0);
                if (currentCount >= 4)
                {
                    movieIndex++;
                    if (movieIndex >= movieSchedule.Count)
                        break;
                    continue;
                }

                var showtime = new Showtimes
                {
                    MovieId = movie.Id,
                    RoomId = room.Id,
                    Date = date,
                    Start = currentTime,
                    End = endTime
                };

                showtimes.Add(showtime);
                movieShowCount[movie.Id] = currentCount + 1;

                // Cập nhật thời gian cho suất chiếu tiếp theo
                currentTime = endTime.AddMinutes(CLEANUP_TIME);
                
                // Chuyển sang phim khác
                movieIndex++;
            }

            return showtimes;
        }

        /// <summary>
        /// AI: Tối ưu hóa danh sách phim để chiếu
        /// Ưu tiên: Rating cao, phim mới, cân bằng thể loại
        /// </summary>
        private List<Movies> OptimizeMovieSchedule(List<Movies> movies, int roomCapacity)
        {
            var schedule = new List<Movies>();
            var totalDayTime = (CLOSING_HOUR - OPENING_HOUR) * 60; // Tổng thời gian hoạt động (phút)
            var usedTime = 0;

            // Tính điểm ưu tiên cho mỗi phim
            var movieScores = movies.Select(m => new
            {
                Movie = m,
                Score = CalculateMovieScore(m),
                Duration = m.Duration
            }).OrderByDescending(m => m.Score).ToList();

            // Phân bổ phim vào lịch
            var genreCount = new Dictionary<string, int>();

            foreach (var item in movieScores)
            {
                // Kiểm tra thời gian còn lại
                if (usedTime + item.Duration + CLEANUP_TIME > totalDayTime)
                    continue;

                // Cân bằng thể loại (không quá nhiều phim cùng thể loại)
                var genres = item.Movie.Genre?.Split(',').Select(g => g.Trim()).ToList() ?? new List<string>();
                var genreOverload = genres.Any(g => genreCount.GetValueOrDefault(g, 0) >= 3);

                if (genreOverload && schedule.Count > 5) // Nếu đã có 5 phim, bắt đầu cân bằng
                    continue;

                schedule.Add(item.Movie);
                usedTime += item.Duration + CLEANUP_TIME;

                // Cập nhật số lượng thể loại
                foreach (var genre in genres)
                {
                    genreCount[genre] = genreCount.GetValueOrDefault(genre, 0) + 1;
                }
            }

            // Nếu còn thời gian và chưa đủ phim, thêm phim phổ biến
            if (schedule.Count < 3 && movies.Count > 0)
            {
                var popularMovies = movies
                    .OrderByDescending(m => m.Rating)
                    .Take(3)
                    .ToList();

                foreach (var movie in popularMovies)
                {
                    if (!schedule.Contains(movie) && usedTime + movie.Duration + CLEANUP_TIME <= totalDayTime)
                    {
                        schedule.Add(movie);
                        usedTime += movie.Duration + CLEANUP_TIME;
                    }
                }
            }

            return schedule;
        }

        /// <summary>
        /// Tính điểm ưu tiên cho phim
        /// </summary>
        private double CalculateMovieScore(Movies movie)
        {
            var score = 0.0;

            // Rating (trọng số: 40%)
            score += movie.Rating * 4;

            // Phim mới (trọng số: 30%)
            var daysSinceRelease = (DateTime.Now - movie.StartDate).Days;
            if (daysSinceRelease <= 7)
                score += 30;
            else if (daysSinceRelease <= 14)
                score += 20;
            else if (daysSinceRelease <= 30)
                score += 10;

            // Thời lượng hợp lý (trọng số: 20%)
            if (movie.Duration >= 90 && movie.Duration <= 150)
                score += 20; // Thời lượng lý tưởng
            else if (movie.Duration < 90)
                score += 10; // Phim ngắn, dễ xếp lịch
            else
                score += 5; // Phim dài, khó xếp

            // Thể loại phổ biến (trọng số: 10%)
            var popularGenres = new[] { "Hành động", "Hài", "Kinh dị", "Khoa học viễn tưởng" };
            if (movie.Genre != null && popularGenres.Any(g => movie.Genre.Contains(g)))
                score += 10;

            return score;
        }

        /// <summary>
        /// Lấy thống kê lịch chiếu
        /// </summary>
        public async Task<object> GetShowtimeStatistics(DateOnly date)
        {
            var showtimes = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                .Where(s => s.Date == date)
                .ToListAsync();

            var totalShowtimes = showtimes.Count;
            var totalMovies = showtimes.Select(s => s.MovieId).Distinct().Count();
            var totalRooms = showtimes.Select(s => s.RoomId).Distinct().Count();

            var movieDistribution = showtimes
                .GroupBy(s => s.Movies?.Title)
                .Select(g => new
                {
                    MovieTitle = g.Key,
                    ShowtimeCount = g.Count(),
                    TotalMinutes = g.Sum(s => s.Movies?.Duration ?? 0)
                })
                .OrderByDescending(x => x.ShowtimeCount)
                .ToList();

            return new
            {
                Date = date,
                TotalShowtimes = totalShowtimes,
                TotalMovies = totalMovies,
                TotalRooms = totalRooms,
                MovieDistribution = movieDistribution,
                GeneratedAt = DateTime.Now
            };
        }
    }
}
