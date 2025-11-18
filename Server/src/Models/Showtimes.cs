using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Showtimes
    {
        public int Id { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }
        public int MovieId { get; set; }
        public int RoomId { get; set; }
        public DateOnly Date { get; set; }

        public Rooms? Rooms { get; set; }
        public Movies? Movies { get; set; }
        // public StatusSeat? StatusSeat { get; set; }
        // public ICollection<StatusSeat>? StatusSeat { get; set; }
    }
}