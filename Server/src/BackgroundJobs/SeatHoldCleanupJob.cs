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
        /// </summary>
        [AutomaticRetry(Attempts = 3)]
        public async Task CheckExpiringSeatHolds()
        {
            try
            {
                var db = _redis.GetDatabase();
                var server = _redis.GetServer(_redis.GetEndPoints().First());
                
                // Lấy TTL từ config (mặc định 10 phút = 600 giây)
                var ttlMinutes = _configuration.GetValue<int>("Redis:SeatHoldTTLMinutes", 10);
                var warningThresholdSeconds = 120; // Cảnh báo khi còn 2 phút

                // Tìm tất cả các key hold:*
                var keys = server.Keys(pattern: "CineBook:hold:*").ToList();
                
                _logger.LogInformation($"[SeatHoldCleanup] Đang kiểm tra {keys.Count} ghế đang giữ...");

                foreach (var key in keys)
                {
                    var ttl = await db.KeyTimeToLiveAsync(key);
                    
                    if (!ttl.HasValue)
                    {
                        _logger.LogWarning($"[SeatHoldCleanup] Key {key} không có TTL, bỏ qua.");
                        continue;
                    }

                    var remainingSeconds = ttl.Value.TotalSeconds;

                    // Nếu còn khoảng 2 phút (120 giây) thì gửi cảnh báo
                    if (remainingSeconds > 0 && remainingSeconds <= warningThresholdSeconds)
                    {
                        var holdId = key.ToString().Replace("CineBook:hold:", "");
                        await _notificationService.SendSeatExpirationWarningAsync(holdId, ttl.Value);
                        _logger.LogWarning($"⚠️ [SeatHoldCleanup] HoldId '{holdId}' sắp hết hạn (còn {remainingSeconds}s)");
                    }
                    
                    // Nếu đã hết hạn (TTL âm hoặc = 0)
                    else if (remainingSeconds <= 0)
                    {
                        var holdId = key.ToString().Replace("CineBook:hold:", "");
                        await _notificationService.SendSeatExpiredNotificationAsync(holdId);
                        _logger.LogInformation($"❌ [SeatHoldCleanup] HoldId '{holdId}' đã hết hạn");
                        
                        // Redis tự động xóa key khi hết TTL, không cần xóa thủ công
                    }
                }

                _logger.LogInformation($"[SeatHoldCleanup] Hoàn tất kiểm tra seat holds.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[SeatHoldCleanup] Lỗi khi kiểm tra seat holds");
                throw; // Để Hangfire retry
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
