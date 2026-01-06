using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Booking;
using Server.src.Services.Interfaces;
using StackExchange.Redis;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffBookingController : ApiControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IConnectionMultiplexer _redis;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public StaffBookingController(
            IBookingService bookingService,
            IConnectionMultiplexer redis,
            IConfiguration configuration,
            ApplicationDbContext context,
            ILogger<StaffBookingController> logger) : base(logger)
        {
            _bookingService = bookingService;
            _redis = redis;
            _configuration = configuration;
            _context = context;
        }

        /// <summary>
        /// 🔒 Bước 1: Staff hold ghế tại quầy vé
        /// </summary>
        [Authorize(Roles = "Staff,Admin")]
        [HttpPost("hold")]
        public async Task<IActionResult> HoldSeatsByStaff([FromBody] HoldByStaffDto dto)
        {
            try
            {
                // Lấy staffId từ JWT token
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
                {
                    return Unauthorized(new { message = "Không xác định được Staff" });
                }

                if (dto.SeatIds == null || !dto.SeatIds.Any())
                {
                    return BadRequest(new { message = "Vui lòng chọn ít nhất 1 ghế" });
                }

                var db = _redis.GetDatabase();
                var ttlMinutes = _configuration.GetValue<int>("Redis:SeatHoldTTLMinutes", 10);
                var holdId = Guid.NewGuid().ToString();

                // Kiểm tra ghế đã được hold chưa (Redis + DB)
                foreach (var seatId in dto.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                    var isHeld = await db.KeyExistsAsync(seatKey);
                    
                    if (isHeld)
                    {
                        var seat = await _context.Seats.FindAsync(seatId);
                        return BadRequest(new { message = $"Ghế {seat?.Name ?? seatId.ToString()} đã được giữ" });
                    }
                }

                // Kiểm tra ghế đã booked trong DB
                var bookedSeats = await _context.StatusSeat
                    .Where(ss => dto.SeatIds.Contains(ss.SeatId)
                              && ss.ShowtimeId == dto.ShowtimeId
                              && (ss.Status == "Booked" || ss.Status == "Pending"))
                    .Select(ss => ss.SeatId)
                    .ToListAsync();

                if (bookedSeats.Any())
                {
                    var seatNames = await _context.Seats
                        .Where(s => bookedSeats.Contains(s.Id))
                        .Select(s => s.Name)
                        .ToListAsync();
                    return BadRequest(new { message = $"Ghế {string.Join(", ", seatNames)} đã được đặt" });
                }

                // Tính tổng tiền
                var seats = await _context.Seats
                    .Where(s => dto.SeatIds.Contains(s.Id))
                    .ToListAsync();

                if (seats.Count != dto.SeatIds.Count)
                {
                    return BadRequest(new { message = "Một số ghế không tồn tại" });
                }

                var totalAmount = (int)seats.Sum(s => s.Price);

                // Hold data
                var holdData = new
                {
                    holdId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    staffId = staffId,
                    customerName = dto.CustomerName,
                    customerPhone = dto.CustomerPhone,
                    customerEmail = dto.CustomerEmail,
                    totalAmount = totalAmount,
                    holdAt = DateTime.UtcNow,
                    expiresAt = DateTime.UtcNow.AddMinutes(ttlMinutes),
                    holdType = "staff"
                };

                var holdKey = $"CineBook:hold:{holdId}";
                var holdDataJson = System.Text.Json.JsonSerializer.Serialize(holdData);
                await db.StringSetAsync(holdKey, holdDataJson, TimeSpan.FromMinutes(ttlMinutes));

                // Đánh dấu từng ghế đang được hold
                foreach (var seatId in dto.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{dto.ShowtimeId}:{seatId}";
                    await db.StringSetAsync(seatKey, holdId, TimeSpan.FromMinutes(ttlMinutes));
                }

                _logger.LogInformation("Staff {StaffId} held {Count} seats for showtime {ShowtimeId}", 
                    staffId, dto.SeatIds.Count, dto.ShowtimeId);

                return Ok(new
                {
                    success = true,
                    message = $"Đã giữ {dto.SeatIds.Count} ghế trong {ttlMinutes} phút",
                    holdId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    seats = seats.Select(s => new { s.Id, s.Name, s.Price }),
                    totalAmount,
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
        /// ✅ Bước 2: Xác nhận booking sau khi khách thanh toán
        /// </summary>
        [Authorize(Roles = "Staff,Admin")]
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmStaffBooking([FromBody] ConfirmStaffBookingDto dto)
        {
            try
            {
                // Lấy staffId từ JWT token
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int staffId))
                {
                    return Unauthorized(new { message = "Không xác định được Staff" });
                }

                var db = _redis.GetDatabase();
                var holdKey = $"CineBook:hold:{dto.HoldId}";

                // Kiểm tra hold có tồn tại không
                var holdDataJson = await db.StringGetAsync(holdKey);
                if (holdDataJson.IsNullOrEmpty)
                {
                    return BadRequest(new { message = "Hold không tồn tại hoặc đã hết hạn. Vui lòng hold lại ghế." });
                }

                // Parse hold data
                var options = new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                var holdData = System.Text.Json.JsonSerializer.Deserialize<StaffHoldDataModel>(holdDataJson!, options);
                
                if (holdData == null || holdData.HoldType != "staff")
                {
                    return BadRequest(new { message = "Hold không hợp lệ hoặc không phải hold của staff" });
                }

                // Kiểm tra số tiền nhận được
                if (dto.PaidAmount < holdData.TotalAmount)
                {
                    return BadRequest(new 
                    { 
                        message = $"Số tiền nhận chưa đủ. Cần: {holdData.TotalAmount:N0}đ, Nhận: {dto.PaidAmount:N0}đ" 
                    });
                }

                // Tạo booking với CreateStaffBookingAsync
                var staffBookingDto = new StaffBookingDto
                {
                    ShowtimeId = holdData.ShowtimeId,
                    SeatIds = holdData.SeatIds,
                    CustomerName = holdData.CustomerName,
                    CustomerPhone = holdData.CustomerPhone,
                    Email = holdData.CustomerEmail,
                    PaymentMethod = dto.PaymentMethod,
                    PaidAmount = dto.PaidAmount
                };

                var booking = await _bookingService.CreateStaffBookingAsync(staffBookingDto, staffId);

                // Xóa hold khỏi Redis
                await db.KeyDeleteAsync(holdKey);
                
                foreach (var seatId in holdData.SeatIds)
                {
                    var seatKey = $"CineBook:seat:{holdData.ShowtimeId}:{seatId}";
                    await db.KeyDeleteAsync(seatKey);
                }

                // Tính tiền thối lại
                var change = dto.PaidAmount - holdData.TotalAmount;

                _logger.LogInformation("Staff {StaffId} confirmed booking {TicketId} with change {Change}", 
                    staffId, booking.TicketId, change);

                return Ok(new
                {
                    success = true,
                    message = "Đặt vé thành công!",
                    booking,
                    totalAmount = holdData.TotalAmount,
                    paidAmount = dto.PaidAmount,
                    change = change
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    // DTOs cho Staff Booking
    public class HoldByStaffDto
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
    }

    public class ConfirmStaffBookingDto
    {
        public string HoldId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = "Cash";
        public decimal PaidAmount { get; set; }
    }

    public class StaffHoldDataModel
    {
        public string HoldId { get; set; } = string.Empty;
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        public int StaffId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime HoldAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string HoldType { get; set; } = "staff";
    }
}
