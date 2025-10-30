using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.ShowTimes;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class ShowtimesMapper
    {
        public static async Task<CreateShowtimeDto> ToCreateShowtimeDto(this Showtimes showtimes)
        {
            return new CreateShowtimeDto
            {
                Start = showtimes.Start,
                End = showtimes.End,
                MovieId = showtimes.MovieId,
                RoomId = showtimes.RoomId
            };
        }

        public static async Task<Showtimes> ToNewShowtime(this CreateShowtimeDto createShowtimeDto)
        {
            return new Showtimes
            {
                Start = createShowtimeDto.Start,
                End = createShowtimeDto.End,
                Date = createShowtimeDto.Date,
                MovieId = createShowtimeDto.MovieId,
                RoomId = createShowtimeDto.RoomId
            };
        }
    }
}