using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.ShowTimes
{
    public class UpdateShowtimeDto
    {
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }
        public DateOnly Date { get; set; }
        public int MovieId { get; set; }
        public int RoomId { get; set; }
    }
}