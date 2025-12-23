using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hangfire;
using Server.src.Services.Interfaces;
using StackExchange.Redis;

namespace Server.src.BackgroundJobs
{
    /// <summary>
    /// Background job tự động dọn dẹp các ghế đã hết hạn giữ
    /// Chạy mỗi 1 phút để kiểm tra và thông báo cho user
    /// </summary>
    public class SeatHoldCleanupJob
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly INotificationService _notificationService;
        private readonly ILogger<SeatHoldCleanupJob> _logger;
        private readonly IConfiguration _configuration;

        public SeatHoldCleanupJob(
            IConnectionMultiplexer redis,
            INotificationService notificationService,
            ILogger<SeatHoldCleanupJob> logger,
            IConfiguration configuration)
        {
            _redis = redis;
            _notificationService = notificationService;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Job chạy định kỳ để kiểm tra các ghế sắp hết hạn
        /// NOTE: Tạm thời disable để tránh timeout, Redis TTL tự động xóa keys
        /// </summary>
        [AutomaticRetry(Attempts = 0)] // Disable retry để tránh spam logs
        public async Task CheckExpiringSeatHolds()
        {
            try
            {
                // ⚠️ TEMPORARY: Disable job vì SCAN operation gây timeout
                // Redis TTL tự động xóa keys sau 10 phút nên không cần job này
                _logger.LogInformation("[SeatHoldCleanup] Job bị disable tạm thời. Redis TTL tự động cleanup.");
                
                await Task.CompletedTask;
                return;
                
                /* ORIGINAL CODE - Uncomment khi cần:
                var db = _redis.GetDatabase();
                
                // Sử dụng async scan thay vì Keys() để tránh block Redis
                var endpoint = _redis.GetEndPoints().First();
                var server = _redis.GetServer(endpoint);
                
                var ttlMinutes = _configuration.GetValue<int>("Redis:SeatHoldTTLMinutes", 10);
                var warningThresholdSeconds = 120;

                var scannedCount = 0;
                await foreach (var key in server.KeysAsync(pattern: "CineBook:hold:*", pageSize: 100))
                {
                    scannedCount++;
                    var ttl = await db.KeyTimeToLiveAsync(key);
                    
                    if (!ttl.HasValue) continue;

                    var remainingSeconds = ttl.Value.TotalSeconds;

                    if (remainingSeconds > 0 && remainingSeconds <= warningThresholdSeconds)
                    {
                        var holdId = key.ToString().Replace("CineBook:hold:", "");
                        await _notificationService.SendSeatExpirationWarningAsync(holdId, ttl.Value);
                        _logger.LogWarning($"⚠️ [SeatHoldCleanup] HoldId '{holdId}' sắp hết hạn (còn {remainingSeconds}s)");
                    }
                    
                    // Giới hạn số lượng keys xử lý mỗi lần
                    if (scannedCount >= 100) break;
                }

                _logger.LogInformation($"[SeatHoldCleanup] Đã kiểm tra {scannedCount} seat holds.");
                */
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SeatHoldCleanup] Lỗi khi kiểm tra seat holds");
                // Không throw để tránh retry
            }
        }

        /// <summary>
        /// Dọn dẹp các seat hold đã expire (Redis tự động làm việc này, job chỉ log)
        /// </summary>
        [AutomaticRetry(Attempts = 3)]
        public async Task CleanupExpiredSeatHolds()
        {
            try
            {
                var db = _redis.GetDatabase();
                var server = _redis.GetServer(_redis.GetEndPoints().First());

                // Tìm tất cả các key hold:* đã expire
                var keys = server.Keys(pattern: "CineBook:hold:*").ToList();
                var expiredCount = 0;

                foreach (var key in keys)
                {
                    var ttl = await db.KeyTimeToLiveAsync(key);
                    
                    // Nếu key không còn tồn tại hoặc đã expire
                    if (!ttl.HasValue || ttl.Value.TotalSeconds <= 0)
                    {
                        expiredCount++;
                        _logger.LogInformation($"🗑️ [SeatHoldCleanup] Key {key} đã hết hạn và bị xóa bởi Redis");
                    }
                }

                _logger.LogInformation($"[SeatHoldCleanup] Đã dọn dẹp {expiredCount} seat holds hết hạn");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SeatHoldCleanup] Lỗi khi dọn dẹp expired seat holds");
                throw;
            }
        }
    }
}
