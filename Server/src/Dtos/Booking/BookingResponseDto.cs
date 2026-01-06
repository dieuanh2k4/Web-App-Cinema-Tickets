using System;
using System.Collections.Generic;

namespace Server.src.Dtos.Booking
{
    /// <summary>
    /// Response trả về sau khi đặt vé thành công
    /// </summary>
    public class BookingResponseDto
    {
        public int TicketId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        
        // Thông tin suất chiếu
        public int ShowtimeId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public DateTime ShowtimeStart { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string TheaterName { get; set; } = string.Empty;
        
        // Ghế đã đặt
        public List<string> SeatNumbers { get; set; } = new();
        
        // Thanh toán
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty; // "Pending", "Paid"
        
        // Cho Staff booking
        public decimal? PaidAmount { get; set; }
        public decimal? ChangeAmount { get; set; } // Tiền thối lại
    }
}
