using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class TicketPrice
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public string? RoomType { get; set; }
        public string? SeatType { get; set; }

        // public Rooms? Rooms { get; set; }
        // public Seats? Seats { get; set; }
    }
}