using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Dashboard;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        // thống kê tổng quan: tổng số phim, số khách hàng, số vé đã bán, doanh thu, số rạp, số suất chiếu
        public async Task<DashboardStatisticsDto> GetStatisticsAsync()
        {
            var totalMovies = await _context.Movies.CountAsync();
            var totalCustomers = await _context.Customers.CountAsync();
            var totalTicketsSold = await _context.Tickets.CountAsync();
            var totalRevenue = await _context.Tickets.SumAsync(t => (decimal)t.TotalPrice);
            var totalTheaters = await _context.Theater.CountAsync();
            var totalShowtimes = await _context.Showtimes.CountAsync();

            return new DashboardStatisticsDto
            {
                TotalMovies = totalMovies,
                TotalCustomers = totalCustomers,
                TotalTicketsSold = totalTicketsSold,
                TotalRevenue = totalRevenue,
                TotalTheaters = totalTheaters,
                TotalShowtimes = totalShowtimes
            };
        }

        // doanh số thu theo từng tháng: doanh thu, số vé bán được
        public async Task<List<RevenueByMonthDto>> GetRevenueByMonthAsync(int? year = null)
        {
            var targetYear = year ?? DateTime.Now.Year;

            var revenueByMonth = await _context.Tickets
                .Where(t => t.Date.Year == targetYear)
                .GroupBy(t => t.Date.Month)
                .Select(g => new RevenueByMonthDto
                {
                    Month = g.Key,
                    Year = targetYear,
                    Revenue = g.Sum(t => (decimal)t.TotalPrice),
                    TicketsSold = g.Count()
                })
                .OrderBy(r => r.Month)
                .ToListAsync();

            return revenueByMonth;
        }

        // danh sách phim bán chạy
        public async Task<List<TopMovieDto>> GetTopMoviesAsync(int limit = 10)
        {
            var topMovies = await _context.Tickets
                .GroupBy(t => new { t.MovieId, t.Movies!.Title, t.Movies.Thumbnail })
                .Select(g => new TopMovieDto
                {
                    MovieId = g.Key.MovieId,
                    Title = g.Key.Title,
                    Thumbnail = g.Key.Thumbnail,
                    TicketsSold = g.Count(),
                    Revenue = g.Sum(t => (decimal)t.TotalPrice),
                    TotalShowtimes = _context.Showtimes.Count(s => s.MovieId == g.Key.MovieId)
                })
                .OrderByDescending(m => m.TicketsSold)
                .Take(limit)
                .ToListAsync();

            return topMovies;
        }
    }
}
