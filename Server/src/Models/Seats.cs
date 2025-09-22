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
        public string? Type { get; set; }
        public int RoomId { get; set; }

        public Rooms? Rooms { get; set; }
        public StatusSeat? StatusSeat { get; set; }
    }
}