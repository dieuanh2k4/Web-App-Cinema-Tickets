using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.ShowTimes;
using Server.src.Services.Interfaces;
using Server.src.Services.Implements;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IShowtimeService _showtimeService;
        private readonly AutoShowtimeService _autoShowtimeService;

        public ShowtimesController(
            ApplicationDbContext context, 
            IShowtimeService showtimeService, 
            ILogger<ShowtimesController> logger) : base(logger)
        {
            _context = context;
            _showtimeService = showtimeService;
            _autoShowtimeService = new AutoShowtimeService(context);
        }

        [AllowAnonymous]
        [HttpGet("get_all_showtime")]
        public async Task<IActionResult> GetShowtime()
        {
            try
            {
                var showtimes = await _showtimeService.GetAllShowtimes();

                if (showtimes == null || showtimes.Count() == 0)
                {
                    return NotFound("Không có suất chiếu nào.");
                }

                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Staff,Admin")]
        [HttpPost("create-showtimes")]
        public async Task<IActionResult> CreateShowtime([FromBody] CreateShowtimeDto createShowtimeDto, int roomId)
        {
            try
            {
                var showtime = await _showtimeService.CreateShowtime(createShowtimeDto, roomId);

                await _context.AddAsync(showtime);
                await _context.SaveChangesAsync();

                return Ok(showtime);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Staff,Admin")]
        [HttpPut("update-showtime/{id}")]
        public async Task<IActionResult> UpdateShowtime([FromBody] UpdateShowtimeDto updateShowtimeDto, int roomId, int id)
        {
            try
            {
                var showtime = await _showtimeService.UpdateShowtime(updateShowtimeDto, roomId, id);

                await _context.SaveChangesAsync();

                return Ok(showtime);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-showtime/{id}")]
        public async Task<IActionResult> DeleteShowtime(int id)
        {
            try
            {
                var showtime = await _showtimeService.DeleteShowtime(id);

                _context.Showtimes.Remove(showtime);
                await _context.SaveChangesAsync();

                return Ok(_showtimeService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [AllowAnonymous]
        [HttpGet("get-showtime-by-movieId")]
        public async Task<IActionResult> GetShowtimeByMovie(int theaterId, int movieId, DateOnly date)
        {
            try
            {
                var showtimes = await _showtimeService.GetShowtimeByMovie(theaterId, movieId, date);

                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [AllowAnonymous]
        [HttpGet("get-showtime-by-theaterid")]
        public async Task<IActionResult> GetShowtimeByTheater(int theaterId,  DateOnly date)
        {
            try
            {
                var showtimes = await _showtimeService.GetShowtimeByTheater(theaterId, date);

                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// AI: Tự động tạo lịch chiếu cho 1 ngày
        /// </summary>
        [AllowAnonymous]
        [HttpPost("auto-generate")]
        public async Task<IActionResult> AutoGenerateShowtimes([FromQuery] DateOnly? date)
        {
            try
            {
                var targetDate = date ?? DateOnly.FromDateTime(DateTime.Now);
                var showtimes = await _autoShowtimeService.GenerateShowtimesForDate(targetDate);

                return Ok(new
                {
                    isSuccess = true,
                    message = $"Đã tạo {showtimes.Count} suất chiếu cho ngày {targetDate:dd/MM/yyyy}",
                    data = showtimes,
                    generatedAt = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// AI: Tự động tạo lịch chiếu cho nhiều ngày
        /// </summary>
        [AllowAnonymous]
        [HttpPost("auto-generate-range")]
        public async Task<IActionResult> AutoGenerateShowtimesRange([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            try
            {
                if (startDate > endDate)
                {
                    return BadRequest(new { isSuccess = false, message = "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" });
                }

                var showtimes = await _autoShowtimeService.GenerateShowtimesForDateRange(startDate, endDate);

                return Ok(new
                {
                    isSuccess = true,
                    message = $"Đã tạo {showtimes.Count} suất chiếu từ {startDate:dd/MM/yyyy} đến {endDate:dd/MM/yyyy}",
                    data = showtimes,
                    generatedAt = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy thống kê lịch chiếu
        /// </summary>
        [AllowAnonymous]
        [HttpGet("statistics")]
        public async Task<IActionResult> GetShowtimeStatistics([FromQuery] DateOnly? date)
        {
            try
            {
                var targetDate = date ?? DateOnly.FromDateTime(DateTime.Now);
                var stats = await _autoShowtimeService.GetShowtimeStatistics(targetDate);

                return Ok(new
                {
                    isSuccess = true,
                    data = stats
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}