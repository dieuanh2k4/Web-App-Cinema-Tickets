using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.ShowTimes
{
    public class ShowtimeDetailDto
    {
        public int Id { get; set; }
        public TimeOnly Start { get; set; }
        public TimeOnly End { get; set; }
        public DateOnly Date { get; set; }
        public int MovieId { get; set; }
        public string? MovieTitle { get; set; }
        public int RoomId { get; set; }
        public string? RoomName { get; set; }
        public string? RoomType { get; set; }
        public int TheaterId { get; set; }
        public string? TheaterName { get; set; }
        public string? TheaterAddress { get; set; }
        public string? TheaterCity { get; set; }
    }
}
