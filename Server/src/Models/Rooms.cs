using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Rooms
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Capacity { get; set; } // sức chứa
        public string? Type { get; set; } // loại phòng 
        public int Rows { get; set; } // số hàng ghế
        public int Columns { get; set; } // số cột ghế
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        // public int TicketpriceId { get; set; }

        private string _status = "Trống";
        public string Status
        {
            get => string.IsNullOrEmpty(_status) ? "Trống" : _status;
            set => _status = string.IsNullOrEmpty(value) ? "Trống" : value;
        }
        public int TheaterId { get; set; }

        public Theater? Theater { get; set; }
        // public TicketPrice? TicketPrice { get; set; }
        public List<Showtimes>? Showtimes { get; set; }
        public List<Seats>? Seats { get; set; }
    }
}