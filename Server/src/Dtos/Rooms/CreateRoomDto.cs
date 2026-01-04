using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Dtos.Rooms
{
    public class CreateRoomDto
    {
        public string? Name { get; set; }
        public int Capacity { get; set; } // sức chứa
        public string? Status { get; set; }
        public int TheaterId { get; set; }
        public string? Type { get; set; }
        public int Rows { get; set; } // số hàng ghế
        public int Columns { get; set; } // số cột ghế
        // public TicketPrice? TicketPrice { get; set; }
        public List<Server.src.Models.Seats>? Seats { get; set; }
    }
}