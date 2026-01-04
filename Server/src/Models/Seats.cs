using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Seats
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Price { get; set; }
        // public int Row { get; set; } // hàng ghế
        // public int Col { get; set; } // cột ghế
        public string? Type { get; set; }
        public int RoomId { get; set; }
        public string? Status { get; set; }

        public Rooms? Rooms { get; set; }
        // public TicketPrice? TicketPrice { get; set; }
        // public List<StatusSeat>? StatusSeat { get; set; }
        // public StatusSeat? StatusSeat { get; set; }
    }
}