using System;
using System.Collections.Generic;

namespace Server.src.Dtos.Booking
{
    /// <summary>
    /// DTO cho Staff tạo vé tại quầy
    /// </summary>
    public class StaffBookingDto
    {
        public int ShowtimeId { get; set; }
        public List<int> SeatIds { get; set; } = new();
        
        // Thông tin khách hàng
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? Email { get; set; } // Email có thể rỗng
        
        // Thanh toán
        public string PaymentMethod { get; set; } = "Cash"; // Cash, Banking, Momo
        public decimal? PaidAmount { get; set; } // Số tiền khách đưa (cho Cash)
    }
}
