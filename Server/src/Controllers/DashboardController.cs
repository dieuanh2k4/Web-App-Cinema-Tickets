using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ApiControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger) : base(logger)
        {
            _dashboardService = dashboardService;
        }

        // thống kê tổng quan
        [Authorize(Roles = "Admin")]
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                var statistics = await _dashboardService.GetStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        // doanh thu theo từng tháng
        [Authorize(Roles = "Admin")]
        [HttpGet("revenue-by-month")]
        public async Task<IActionResult> GetRevenueByMonth([FromQuery] int? year = null)
        {
            try
            {
                var revenueData = await _dashboardService.GetRevenueByMonthAsync(year);
                return Ok(revenueData);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        // danh sách phim bán chạy nhất
        [Authorize(Roles = "Admin")]
        [HttpGet("top-movies")]
        public async Task<IActionResult> GetTopMovies([FromQuery] int limit = 10)
        {
            try
            {
                var topMovies = await _dashboardService.GetTopMoviesAsync(limit);
                return Ok(topMovies);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
