using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ILogger<NotificationService> logger)
        {
            _logger = logger;
        }

        public async Task SendNotificationAsync(string userId, string message)
        {
            // TODO: Tích hợp với SignalR hoặc Email/SMS service thực tế
            _logger.LogInformation($"[NOTIFICATION] UserId: {userId}, Message: {message}");
            await Task.CompletedTask;
        }

        public async Task SendSeatExpirationWarningAsync(string holdId, TimeSpan remainingTime)
        {
            var message = $"⚠️ Ghế của bạn (HoldId: {holdId}) sẽ hết hạn sau {remainingTime.Minutes} phút {remainingTime.Seconds} giây. Vui lòng hoàn tất thanh toán!";
            _logger.LogWarning(message);
            
            // TODO: Gửi thông báo thực tế cho user qua SignalR/Email/SMS
            await Task.CompletedTask;
        }

        public async Task SendSeatExpiredNotificationAsync(string holdId)
        {
            var message = $"❌ Ghế của bạn (HoldId: {holdId}) đã hết hạn giữ. Vui lòng chọn lại ghế.";
            _logger.LogInformation(message);
            
            // TODO: Gửi thông báo thực tế cho user
            await Task.CompletedTask;
        }
    }
}
