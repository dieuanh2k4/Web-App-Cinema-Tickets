using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.src.Dtos.Booking;
using Server.src.Services.Interfaces;
using Server.src.Services.Implements;
using StackExchange.Redis;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ApiControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IConnectionMultiplexer _redis;
        private readonly IConfiguration _configuration;
        private readonly DistributedLockService _lockService;

        public BookingController(
            IBookingService bookingService, 
            IConnectionMultiplexer redis,
            IConfiguration configuration,
            DistributedLockService lockService,
            ILogger<BookingController> logger) : base(logger)
        {
            _bookingService = bookingService;
            _redis = redis;
            _configuration = configuration;
            _lockService = lockService;
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

        /// <summary>
        /// 🔒 Bước 1: Giữ ghế trong 10 phút (Hold Seats)
        /// User chọn ghế → Backend hold ghế trong Redis với TTL 10 phút
        /// ⭐ Phase 2: Sử dụng Distributed Lock để ngăn race condition 100%
        /// </summary>
        [AllowAnonymous]
        [HttpPost("hold-seats")]
        public async Task<IActionResult> HoldSeats([FromBody] HoldSeatsDto dto)
        {
            try
            {
                if (dto.SeatIds == null || !dto.SeatIds.Any())
                {
                    return BadRequest(new { message = "Vui lòng chọn ít nhất 1 ghế" });
                }

                // ⭐ Phase 2: Acquire distributed lock cho showtime + seats
                var lockResource = $"booking:lock:{dto.ShowtimeId}:{string.Join(",", dto.SeatIds.OrderBy(x => x))}";
                
                var result = await _lockService.ExecuteWithLockAsync(
                    lockResource,
                    async () =>
                    {
                        var db = _redis.GetDatabase();
                        var ttlMinutes = _configuration.GetValue<int>("Redis:SeatHoldTTLMinutes", 10);
                        var holdId = Guid.NewGuid().ToString();
                        var holdKey = $"CineBook:hold:{holdId}";

                        // Kiểm tra xem các ghế đã được hold chưa (bên trong lock)
                        foreach (var seatId in dto.SeatIds)
                        {
                            var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                            var isHeld = await db.KeyExistsAsync(seatKey);
                            
                            if (isHeld)
                            {
                                throw new InvalidOperationException($"Ghế {seatId} đã được giữ bởi người khác");
                            }
                        }

                        // Hold các ghế trong Redis với TTL 10 phút
                        var holdData = new
                        {
                            holdId,
                            showtimeId = dto.ShowtimeId,
                            seatIds = dto.SeatIds,
                            userId = dto.UserId,
                            holdAt = DateTime.UtcNow,
                            expiresAt = DateTime.UtcNow.AddMinutes(ttlMinutes)
                        };

                        var holdDataJson = System.Text.Json.JsonSerializer.Serialize(holdData);
                        await db.StringSetAsync(holdKey, holdDataJson, TimeSpan.FromMinutes(ttlMinutes));

                        // Đánh dấu từng ghế là đang được hold
                        foreach (var seatId in dto.SeatIds)
                        {
                            var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                            await db.StringSetAsync(seatKey, holdId, TimeSpan.FromMinutes(ttlMinutes));
                        }

                        return new
                        {
                            success = true,
                            message = $"Đã giữ {dto.SeatIds.Count} ghế trong {ttlMinutes} phút",
                            holdId,
                            showtimeId = dto.ShowtimeId,
                            seatIds = dto.SeatIds,
                            expiresAt = holdData.expiresAt,
                            ttlSeconds = ttlMinutes * 60
                        };
                    },
                    TimeSpan.FromSeconds(10) // Lock timeout: 10 giây
                );

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// ✅ Bước 2: Xác nhận đặt vé (Confirm Booking)
        /// User thanh toán thành công → Backend tạo vé và xóa hold trong Redis
        /// </summary>
        [AllowAnonymous]
        [HttpPost("confirm-booking")]
        public async Task<IActionResult> ConfirmBooking([FromBody] ConfirmBookingDto dto)
        {
            try
            {
                var db = _redis.GetDatabase();
                var holdKey = $"CineBook:hold:{dto.HoldId}";

                // Kiểm tra hold có tồn tại không
                var holdDataJson = await db.StringGetAsync(holdKey);
                if (holdDataJson.IsNullOrEmpty)
                {
                    return BadRequest(new { message = "Hold không tồn tại hoặc đã hết hạn. Vui lòng chọn lại ghế." });
                }

                // Parse hold data
                var holdData = System.Text.Json.JsonSerializer.Deserialize<HoldDataModel>(holdDataJson!);
                
                if (holdData == null)
                {
                    return BadRequest(new { message = "Dữ liệu hold không hợp lệ" });
                }

                // Tạo booking thực tế trong database
                var createBookingDto = new CreateBookingDto
                {
                    ShowtimeId = holdData.ShowtimeId,
                    SeatIds = holdData.SeatIds,
                    CustomerName = dto.CustomerName,
                    PhoneNumber = dto.CustomerPhone,
                    Email = dto.CustomerEmail,
                    PaymentMethod = "Banking" // Mặc định vì đã thanh toán online
                };

                var booking = await _bookingService.CreateGuestBookingAsync(createBookingDto);

                // Xóa hold khỏi Redis (đã confirm thành công)
                await db.KeyDeleteAsync(holdKey);
                
                foreach (var seatId in holdData.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{holdData.ShowtimeId}:{seatId}";
                    await db.KeyDeleteAsync(seatKey);
                }

                return Ok(new
                {
                    success = true,
                    message = "Đặt vé thành công!",
                    booking,
                    holdId = dto.HoldId,
                    releasedSeats = holdData.SeatIds.Count
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    // DTOs
    public class HoldSeatsDto
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public string? UserId { get; set; }
    }

    public class ConfirmBookingDto
    {
        public string HoldId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
    }

    public class HoldDataModel
    {
        public string HoldId { get; set; } = string.Empty;
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public string? UserId { get; set; }
        public DateTime HoldAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
