using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.src.Dtos.Booking;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ApiControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService, ILogger<BookingController> logger) : base(logger)
        {
            _bookingService = bookingService;
        }

        /// <summary>
        /// Guest đặt vé (không cần đăng nhập)
        /// </summary>
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto dto)
        {
            try
            {
                var result = await _bookingService.CreateGuestBookingAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Staff tạo vé tại quầy (thanh toán tiền mặt)
        /// </summary>
        [Authorize(Roles = "Staff,Admin")]
        [HttpPost("create-by-staff")]
        public async Task<IActionResult> CreateBookingByStaff([FromBody] StaffBookingDto dto)
        {
            try
            {
                // Lấy UserId từ JWT token
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
                {
                    return Unauthorized(new { message = "Không xác định được Staff" });
                }

                var result = await _bookingService.CreateStaffBookingAsync(dto, staffId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy danh sách ghế khả dụng cho suất chiếu
        /// </summary>
        [AllowAnonymous]
        [HttpGet("available-seats/{showtimeId}")]
        public async Task<IActionResult> GetAvailableSeats(int showtimeId)
        {
            try
            {
                var seatIds = await _bookingService.GetAvailableSeatsAsync(showtimeId);
                return Ok(new
                {
                    showtimeId = showtimeId,
                    availableSeatIds = seatIds,
                    count = seatIds.Count
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
