using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Dashboard;

namespace Server.src.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardStatisticsDto> GetStatisticsAsync();
        Task<List<RevenueByMonthDto>> GetRevenueByMonthAsync(int? year = null);
        Task<List<TopMovieDto>> GetTopMoviesAsync(int limit = 10);
    }
}
