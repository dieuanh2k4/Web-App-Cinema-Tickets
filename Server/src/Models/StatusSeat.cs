using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Rooms;

namespace Server.src.Models
{
    public class StatusSeat
    {
        public int Id { get; set; }
        public int? ShowtimeId { get; set; }
        public int SeatId { get; set; }
        public string? Status { get; set; }

        public Showtimes? Showtimes { get; set; }
        public Seats? Seats { get; set; }
    }
}