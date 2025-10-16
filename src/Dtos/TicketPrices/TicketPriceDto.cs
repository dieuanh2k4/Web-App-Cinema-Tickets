using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.TicketPrices
{
    public class TicketPriceDto
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public string? RoomType { get; set; }
        public string? SeatType { get; set; }
    }
}