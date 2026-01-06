using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Seats
{
    public class UpdateSeatLayoutDto
    {
        public List<SeatUpdateDto>? Seats { get; set; }
    }

    public class SeatUpdateDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Price { get; set; }
        // public int Row { get; set; }
        // public int Col { get; set; }
        public string? Type { get; set; }
        public string? Status { get; set; }
    }
}
