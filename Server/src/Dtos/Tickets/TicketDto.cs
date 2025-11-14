using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Tickets
{
    public class TicketDto
    {
        public int Id { get; set; }
        public int ShowtimeId { get; set; }
        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public int MovieId { get; set; }
        public string? MovieTitle { get; set; }
        public int RoomId { get; set; }
        public string? RoomName { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public List<SeatInfoDto>? Seats { get; set; }
        public int SumOfSeat { get; set; }
        public int TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SeatInfoDto
    {
        public int SeatId { get; set; }
        public string? SeatName { get; set; }
        public string? SeatType { get; set; }
        public int Price { get; set; }
    }
}
