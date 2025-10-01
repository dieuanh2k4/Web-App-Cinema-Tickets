using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Dtos.Rooms
{
    public class RoomDto
    {
        // public int Id { get; set; }
        public string? Name { get; set; }
        public int Capacity { get; set; } // sức chứa
        public string? Status { get; set; }
        public int TheaterId { get; set; }
        public List<CreateSeatDto>? Seats { get; set; }
    }
}