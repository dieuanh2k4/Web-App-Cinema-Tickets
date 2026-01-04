using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Dashboard
{
    public class TopMovieDto
    {
        public int MovieId { get; set; }
        public string? Title { get; set; }
        public string? Thumbnail { get; set; }
        public int TicketsSold { get; set; }
        public decimal Revenue { get; set; }
        public int TotalShowtimes { get; set; }
    }
}
