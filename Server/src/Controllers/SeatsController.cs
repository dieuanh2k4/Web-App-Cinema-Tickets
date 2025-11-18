using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.src.Data;
using Server.src.Dtos.Seats;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatsController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeatsController(ApplicationDbContext context, ILogger<SeatsController> logger) : base(logger)
        {
            _context = context;
        }

        /// <summary>
        /// Lấy danh sách ghế và trạng thái theo suất chiếu
        /// </summary>
        [AllowAnonymous]
        [HttpGet("showtime/{showtimeId}")]
        public async Task<IActionResult> GetSeatsByShowtime(int showtimeId)
        {
            try
            {
                var showtime = await _context.Showtimes
                    .Include(s => s.Rooms)
                    .FirstOrDefaultAsync(s => s.Id == showtimeId);

                if (showtime == null)
                {
                    return NotFound(new { message = "Suất chiếu không tồn tại" });
                }

                var seats = await _context.Seats
                    .Where(s => s.RoomId == showtime.RoomId)
                    .OrderBy(s => s.Name)
                    .ToListAsync();

                var bookedSeatIds = await _context.Tickets
                    .Where(t => t.ShowtimeId == showtimeId)
                    .Select(t => t.SeatId)
                    .Distinct()
                    .ToListAsync();

                var seatAvailability = seats.Select(seat => new SeatAvailabilityDto
                {
                    SeatId = seat.Id,
                    SeatNumber = seat.Name ?? "",
                    SeatType = seat.Type ?? "",
                    IsAvailable = !bookedSeatIds.Contains(seat.Id),
                    Status = bookedSeatIds.Contains(seat.Id) ? "Booked" : "Available"
                }).ToList();

                return Ok(new
                {
                    showtimeId = showtimeId,
                    roomName = showtime.Rooms?.Name,
                    totalSeats = seats.Count,
                    availableSeats = seatAvailability.Count(s => s.IsAvailable),
                    bookedSeats = seatAvailability.Count(s => !s.IsAvailable),
                    seats = seatAvailability
                });
            }
            catch (System.Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Kiểm tra ghế có khả dụng không
        /// </summary>
        [AllowAnonymous]
        [HttpPost("check-availability")]
        public async Task<IActionResult> CheckSeatAvailability([FromBody] CheckSeatRequest request)
        {
            try
            {
                var bookedSeats = await _context.Tickets
                    .Where(t => t.ShowtimeId == request.ShowtimeId && request.SeatIds.Contains(t.SeatId))
                    .Select(t => t.SeatId)
                    .ToListAsync();

                if (bookedSeats.Any())
                {
                    return BadRequest(new
                    {
                        isAvailable = false,
                        message = $"Ghế {string.Join(", ", bookedSeats)} đã được đặt",
                        bookedSeatIds = bookedSeats
                    });
                }

                return Ok(new
                {
                    isAvailable = true,
                    message = "Tất cả ghế đều khả dụng"
                });
            }
            catch (System.Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    public class CheckSeatRequest
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
    }
}
