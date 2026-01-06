using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Dashboard
{
    public class DashboardStatisticsDto
    {
        public int TotalMovies { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalTicketsSold { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalTheaters { get; set; }
        public int TotalShowtimes { get; set; }
    }
}
