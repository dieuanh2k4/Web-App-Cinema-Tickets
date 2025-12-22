using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Services.Interfaces
{
    public interface INotificationService
    {
        /// <summary>
        /// Gửi thông báo cho khách hàng
        /// </summary>
        Task SendNotificationAsync(string userId, string message);
        
        /// <summary>
        /// Gửi thông báo khi ghế sắp hết hạn giữ (còn 2 phút)
        /// </summary>
        Task SendSeatExpirationWarningAsync(string holdId, TimeSpan remainingTime);
        
        /// <summary>
        /// Gửi thông báo khi ghế đã hết hạn giữ
        /// </summary>
        Task SendSeatExpiredNotificationAsync(string holdId);
    }
}
