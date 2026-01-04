using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class TicketSeat
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int SeatId { get; set; }
        
        public Ticket? Ticket { get; set; }
        public Seats? Seat { get; set; }
    }
}
