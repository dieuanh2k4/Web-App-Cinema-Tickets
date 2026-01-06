namespace Server.src.Dtos.Seats
{
    public class SeatAvailabilityDto
    {
        public int SeatId { get; set; }
        public string SeatNumber { get; set; } = string.Empty;
        public string SeatType { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public string Status { get; set; } = string.Empty; // "Available", "Booked", "Locked"
        public int Price { get; set; }
    }
}
