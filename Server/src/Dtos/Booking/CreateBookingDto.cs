using System;
using System.Collections.Generic;

namespace Server.src.Dtos.Booking
{
    /// <summary>
    /// DTO cho Guest đặt vé (không cần đăng nhập)
    /// </summary>
    public class CreateBookingDto
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        
        // Thông tin khách hàng
        public string CustomerName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? Email { get; set; }
        
        // Thanh toán
        public string PaymentMethod { get; set; } = string.Empty; // "Cash", "Momo", "Banking"
    }
}
