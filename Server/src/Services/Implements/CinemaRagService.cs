using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Services.Interfaces;
using System.Text;

namespace Server.src.Services.Implements
{
    public class CinemaRagService : ICinemaRagService
    {
        private readonly ApplicationDbContext _db;

        // ⭐ RAG: Inject DbContext
        public CinemaRagService(ApplicationDbContext db)
        {
            _db = db;
        }

        // ⭐ RAG: Build context cho AI dựa trên DB thật
        public async Task<string> BuildMovieContextAsync()
        {
            var sb = new StringBuilder();
            var today = DateTime.UtcNow.Date; // ⭐ RAG: Dùng UtcNow theo yêu cầu

            // ⭐ RAG: 1. Phim đang chiếu
            var allMovies = await _db.Movies
                .ToListAsync(); // ⭐ RAG: Query DB trước

            var movies = allMovies
                .Where(m => m.Status == "Đang chiếu") // ⭐ RAG: Lọc trong memory
                .Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.Genre,
                    m.Duration,
                    m.AgeLimit,
                    m.Description
                })
                .ToList();
                
            if (!movies.Any())
            {
                sb.AppendLine("Không có phim nào đang chiếu.");
                return sb.ToString();
            }

            sb.AppendLine("DANH SÁCH PHIM ĐANG CHIẾU:");
            foreach (var m in movies)
            {
                sb.AppendLine($"- {m.Title}");
                sb.AppendLine($"  Thể loại: {m.Genre}");
                sb.AppendLine($"  Thời lượng: {m.Duration} phút | Độ tuổi: {m.AgeLimit}");
                sb.AppendLine($"  Mô tả: {m.Description}");
            }

            // ⭐ RAG: 2. Suất chiếu hôm nay
            var showtimes = await _db.Showtimes
                .Include(s => s.Movies) // ⭐ RAG: Join phim
                .Where(s => s.Date == DateOnly.FromDateTime(today)) // ⭐ RAG: Lọc hôm nay
                .OrderBy(s => s.Start)
                .ToListAsync();

            if (showtimes.Any())
            {
                sb.AppendLine("\nSUẤT CHIẾU HÔM NAY (UTC):");
                foreach (var s in showtimes)
                {
                    sb.AppendLine(
                        $"- {s.Movies.Title}: {s.Start:HH:mm} - {s.End:HH:mm}"
                    );
                }
            }

            // ⭐ RAG: 3. Giá vé từ TicketPrice
            var prices = await _db.TicketPrices.ToListAsync();
            if (prices.Any())
            {
                sb.AppendLine("\nGIÁ VÉ:");
                foreach (var p in prices)
                {
                    sb.AppendLine(
                        $"- Phòng {p.RoomType} | Ghế {p.SeatType}: {p.Price:N0} VND"
                    );
                }
            }

            return sb.ToString(); // ⭐ RAG: Trả context cho AI
        }
    }
}
