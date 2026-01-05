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
using Server.src.Data;
using StackExchange.Redis;
using Microsoft.EntityFrameworkCore;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ApiControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IConnectionMultiplexer _redis;
        private readonly IConfiguration _configuration;
        private readonly IDistributedLockService _lockService;
        private readonly ApplicationDbContext _context;

        public BookingController(
            IBookingService bookingService, 
            IConnectionMultiplexer redis,
            IConfiguration configuration,
            IDistributedLockService lockService,
            ApplicationDbContext context,
            ILogger<BookingController> logger) : base(logger)
        {
            _bookingService = bookingService;
            _redis = redis;
            _configuration = configuration;
            _lockService = lockService;
            _context = context;
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
        /// ⭐ BẮT BUỘC đăng nhập
        /// </summary>
        [Authorize]
        [HttpPost("hold-seats")]
        public async Task<IActionResult> HoldSeats([FromBody] HoldSeatsDto dto)
        {
            try
            {
                // Lấy userId từ JWT token
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Vui lòng đăng nhập để đặt vé" });
                }

                if (dto.SeatIds == null || !dto.SeatIds.Any())
                {
                    return BadRequest(new { message = "Vui lòng chọn ít nhất 1 ghế" });
                }

                var db = _redis.GetDatabase();
                var ttlMinutes = _configuration.GetValue<int>("Redis:SeatHoldTTLMinutes", 10);
                var holdId = Guid.NewGuid().ToString();

                // Kiểm tra xem các ghế đã được hold chưa
                foreach (var seatId in dto.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                    var isHeld = await db.KeyExistsAsync(seatKey);
                    
                    if (isHeld)
                    {
                        return BadRequest(new { message = $"Ghế {seatId} đã được giữ bởi người khác" });
                    }
                }

                // Lấy thông tin user từ database
                var user = await _context.User.FindAsync(userId);
                if (user == null)
                {
                    return BadRequest(new { message = "Không tìm thấy thông tin người dùng" });
                }

                // Hold data
                var holdData = new
                {
                    holdId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    userId = userId,
                    customerName = user.Name,
                    customerPhone = user.phoneNumber,
                    customerEmail = user.Email,
                    holdAt = DateTime.UtcNow,
                    expiresAt = DateTime.UtcNow.AddMinutes(ttlMinutes)
                };

                var holdKey = $"CineBook:hold:{holdId}";
                var holdDataJson = System.Text.Json.JsonSerializer.Serialize(holdData);
                await db.StringSetAsync(holdKey, holdDataJson, TimeSpan.FromMinutes(ttlMinutes));

                // Đánh dấu từng ghế là đang được hold
                foreach (var seatId in dto.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                    await db.StringSetAsync(seatKey, holdId, TimeSpan.FromMinutes(ttlMinutes));
                }

                return Ok(new
                {
                    success = true,
                    message = $"Đã giữ {dto.SeatIds.Count} ghế trong {ttlMinutes} phút",
                    holdId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    expiresAt = holdData.expiresAt,
                    ttlSeconds = ttlMinutes * 60
                });
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
        [Authorize]
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
                _logger.LogInformation("Raw holdDataJson: {HoldDataJson}", holdDataJson.ToString());
                
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var holdData = System.Text.Json.JsonSerializer.Deserialize<HoldDataModel>(holdDataJson!, options);
                
                if (holdData == null)
                {
                    return BadRequest(new { message = "Dữ liệu hold không hợp lệ" });
                }

                // Debug: Log holdData để kiểm tra
                _logger.LogInformation("HoldData parsed: ShowtimeId={ShowtimeId} (Type: {Type}), SeatIds={SeatIds}", 
                    holdData.ShowtimeId, holdData.ShowtimeId.GetType().Name, string.Join(",", holdData.SeatIds));

                // Tạo booking thực tế trong database
                var createBookingDto = new CreateBookingDto
                {
                    ShowtimeId = holdData.ShowtimeId,
                    SeatIds = holdData.SeatIds,
                    CustomerName = holdData.CustomerName,
                    PhoneNumber = holdData.CustomerPhone,
                    Email = holdData.CustomerEmail,
                    PaymentMethod = "Banking" // Mặc định vì đã thanh toán online
                };

                _logger.LogInformation("[BookingController] Before CreateGuestBookingAsync - ShowtimeId: {ShowtimeId}, SeatCount: {SeatCount}", 
                    createBookingDto.ShowtimeId, createBookingDto.SeatIds.Count);

                var booking = await _bookingService.CreateGuestBookingAsync(createBookingDto);

                // ✅ Thêm: Update StatusSeat từ Pending → Booked
                var statusSeats = await _context.StatusSeat
                    .Where(ss => ss.ShowtimeId == holdData.ShowtimeId 
                            && holdData.SeatIds.Contains(ss.SeatId)
                            && ss.Status == "Pending")
                    .ToListAsync();

                foreach (var ss in statusSeats)
                {
                    ss.Status = "Booked";
                }
                await _context.SaveChangesAsync();
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
                    booking
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
    }

    public class ConfirmBookingDto
    {
        public string HoldId { get; set; } = string.Empty;
    }

    public class HoldDataModel
    {
        public string HoldId { get; set; } = string.Empty;
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public int UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public DateTime HoldAt { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
