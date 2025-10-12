using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.ShowTimes;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class ShowtimeMapper
    {
        public static async Task<ShowtimeDto> ToShowtimeDto(this Showtimes showtimes)
        {
            return new ShowtimeDto
            {
                Start = showtimes.Start,
                End = showtimes.End,
                MovieId = showtimes.MovieId,
                RoomId = showtimes.RoomId
            };
        }
    }
}