using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Dtos.Rooms
{
    public class CreateSeatDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Price { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }
        // public TicketPrice? TicketPrice { get; set; }

        // public StatusSeat? StatusSeat { get; set; }
    }
}