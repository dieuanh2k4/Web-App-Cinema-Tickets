using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public int CustomerId { get; set; }
        public int SeatId { get; set; }
        public int RoomId { get; set; }
        public int MovieId { get; set; }
        public int SumOfSeat { get; set; }
        public DateOnly Date { get; set; }
        public int TotalPrice { get; set; }

        public Payment? Payment { get; set; }
    }
}