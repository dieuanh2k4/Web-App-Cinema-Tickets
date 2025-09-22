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
        public string? Status { get; set; }
        public int TheaterId { get; set; }

        public Theater? Theater { get; set; }
        public ICollection<Showtimes>? Showtimes { get; set; }
        public ICollection<Seats>? Seats { get; set; }
    }
}