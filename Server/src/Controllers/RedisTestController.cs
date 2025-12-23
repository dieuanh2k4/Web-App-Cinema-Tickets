using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using Server.src.Controllers;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RedisTestController : ApiControllerBase
    {
        private readonly IConnectionMultiplexer _redis;

        public RedisTestController(IConnectionMultiplexer redis, ILogger<RedisTestController> logger) 
            : base(logger)
        {
            _redis = redis;
        }

        /// <summary>
        /// Test Redis connection
        /// </summary>
        [HttpGet("ping")]
        public async Task<IActionResult> TestRedisConnection()
        {
            try
            {
                var db = _redis.GetDatabase();
                
                // Test write
                var testKey = "test:ping";
                var testValue = $"Hello Redis at {DateTime.Now:yyyy-MM-dd HH:mm:ss}";
                await db.StringSetAsync(testKey, testValue, TimeSpan.FromSeconds(30));
                
                // Test read
                var retrievedValue = await db.StringGetAsync(testKey);
                
                return Ok(new
                {
                    success = true,
                    message = "Redis connected successfully!",
                    connection = new
                    {
                        endpoints = _redis.GetEndPoints().Select(e => e.ToString()).ToArray(),
                        isConnected = _redis.IsConnected
                    },
                    test = new
                    {
                        key = testKey,
                        writtenValue = testValue,
                        retrievedValue = retrievedValue.ToString(),
                        expiresIn = "30 seconds"
                    },
                    timestamp = DateTime.Now
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Test seat hold simulation (giả lập giữ ghế 10 phút) - Support nhiều ghế
        /// </summary>
        [HttpPost("hold-seat")]
        public async Task<IActionResult> TestSeatHold([FromBody] TestSeatHoldDto dto)
        {
            try
            {
                var db = _redis.GetDatabase();
                var sessionId = dto.SessionId ?? Guid.NewGuid().ToString();
                var holdId = Guid.NewGuid().ToString();
                var ttl = TimeSpan.FromMinutes(10);
                
                // Kiểm tra tất cả ghế đã được giữ chưa
                var alreadyHeldSeats = new List<int>();
                foreach (var seatId in dto.SeatIds)
                {
                    var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
                    var existingHolder = await db.StringGetAsync(holdKey);
                    
                    // ✅ FIX: So sánh với sessionId thay vì holdId
                    if (!existingHolder.IsNullOrEmpty && existingHolder != sessionId)
                    {
                        alreadyHeldSeats.Add(seatId);
                    }
                }
                
                if (alreadyHeldSeats.Any())
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = $"Các ghế sau đã được giữ: {string.Join(", ", alreadyHeldSeats)}",
                        alreadyHeldSeats
                    });
                }
                
                // ✅ FIX: Lưu sessionId thay vì holdId để có thể verify ownership
                foreach (var seatId in dto.SeatIds)
                {
                    var holdKey = $"seat_hold:{dto.ShowtimeId}:{seatId}";
                    await db.StringSetAsync(holdKey, sessionId, ttl);
                }
                
                // Lưu thông tin hold chi tiết
                var holdInfoKey = $"hold_info:{holdId}";
                var holdInfo = System.Text.Json.JsonSerializer.Serialize(new
                {
                    holdId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    sessionId,
                    holdAt = DateTime.UtcNow,
                    expiresAt = DateTime.UtcNow.Add(ttl)
                });
                await db.StringSetAsync(holdInfoKey, holdInfo, ttl);
                
                return Ok(new
                {
                    success = true,
                    message = $"Đã giữ {dto.SeatIds.Count} ghế thành công!",
                    holdId,
                    sessionId,
                    showtimeId = dto.ShowtimeId,
                    seatIds = dto.SeatIds,
                    expiresAt = DateTime.Now.Add(ttl),
                    ttlSeconds = (int)ttl.TotalSeconds
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Kiểm tra trạng thái ghế hold
        /// </summary>
        [HttpGet("check-seat/{showtimeId}/{seatId}")]
        public async Task<IActionResult> CheckSeatHold(int showtimeId, int seatId)
        {
            try
            {
                var db = _redis.GetDatabase();
                var holdKey = $"seat_hold:{showtimeId}:{seatId}";
                
                var holder = await db.StringGetAsync(holdKey);
                var ttl = await db.KeyTimeToLiveAsync(holdKey);
                
                if (holder.IsNullOrEmpty)
                {
                    return Ok(new
                    {
                        isHeld = false,
                        message = "Ghế đang trống, có thể đặt"
                    });
                }
                
                return Ok(new
                {
                    isHeld = true,
                    message = "Ghế đang được giữ",
                    holdBy = holder.ToString(),
                    remainingSeconds = ttl?.TotalSeconds ?? 0,
                    expiresAt = ttl.HasValue ? DateTime.Now.Add(ttl.Value) : (DateTime?)null
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Release ghế (giải phóng)
        /// </summary>
        [HttpDelete("release-seat/{showtimeId}/{seatId}")]
        public async Task<IActionResult> ReleaseSeat(int showtimeId, int seatId, [FromQuery] string? sessionId)
        {
            try
            {
                var db = _redis.GetDatabase();
                var holdKey = $"seat_hold:{showtimeId}:{seatId}";
                
                // Nếu có sessionId, verify trước khi release
                if (!string.IsNullOrEmpty(sessionId))
                {
                    var holder = await db.StringGetAsync(holdKey);
                    if (!holder.IsNullOrEmpty && holder != sessionId)
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = "Bạn không có quyền release ghế này",
                            holdBy = holder.ToString()
                        });
                    }
                }
                
                var deleted = await db.KeyDeleteAsync(holdKey);
                
                return Ok(new
                {
                    success = deleted,
                    message = deleted ? "Ghế đã được giải phóng" : "Ghế không tồn tại hoặc đã hết hạn"
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy tất cả ghế đang hold cho suất chiếu
        /// </summary>
        [HttpGet("held-seats/{showtimeId}")]
        public async Task<IActionResult> GetHeldSeats(int showtimeId)
        {
            try
            {
                var db = _redis.GetDatabase();
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                
                var pattern = $"*seat_hold:{showtimeId}:*";
                var keys = server.Keys(pattern: pattern, pageSize: 100).ToList();
                
                var heldSeats = new List<object>();
                
                foreach (var key in keys)
                {
                    var parts = key.ToString().Split(':');
                    var seatId = parts.Length > 2 ? parts.Last() : "unknown";
                    var holder = await db.StringGetAsync(key);
                    var ttl = await db.KeyTimeToLiveAsync(key);
                    
                    heldSeats.Add(new
                    {
                        seatId = seatId,
                        holdBy = holder.ToString(),
                        remainingSeconds = ttl?.TotalSeconds ?? 0
                    });
                }
                
                return Ok(new
                {
                    showtimeId = showtimeId,
                    totalHeldSeats = heldSeats.Count,
                    seats = heldSeats
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    public class TestSeatHoldDto
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new(); // Thay đổi từ SeatId thành SeatIds (mảng)
        public string? SessionId { get; set; }
    }
}
