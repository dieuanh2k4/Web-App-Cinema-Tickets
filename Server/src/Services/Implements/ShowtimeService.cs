using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.ShowTimes;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class ShowtimeService : IShowtimeService
    {
        private readonly ApplicationDbContext _context;

        public ShowtimeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShowtimeDetailDto>> GetShowtimesByMovieId(int movieId)
        {
            var showtimes = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                    .ThenInclude(r => r.Theater)
                .Where(s => s.MovieId == movieId)
                .OrderBy(s => s.Date)
                    .ThenBy(s => s.Start)
                .Select(s => new ShowtimeDetailDto
                {
                    Id = s.Id,
                    Start = s.Start,
                    End = s.End,
                    Date = s.Date,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movies!.Title,
                    RoomId = s.RoomId,
                    RoomName = s.Rooms!.Name,
                    RoomType = s.Rooms!.Type,
                    TheaterId = s.Rooms!.TheaterId,
                    TheaterName = s.Rooms!.Theater!.Name,
                    TheaterAddress = s.Rooms!.Theater!.Address,
                    TheaterCity = s.Rooms!.Theater!.City
                })
                .ToListAsync();

            return showtimes;
        }

        public async Task<List<ShowtimeDetailDto>> GetShowtimesByMovieIdAndDate(int movieId, DateOnly date)
        {
            var showtimes = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                    .ThenInclude(r => r.Theater)
                .Where(s => s.MovieId == movieId && s.Date == date)
                .OrderBy(s => s.Start)
                .Select(s => new ShowtimeDetailDto
                {
                    Id = s.Id,
                    Start = s.Start,
                    End = s.End,
                    Date = s.Date,
                    MovieId = s.MovieId,
                    MovieTitle = s.Movies!.Title,
                    RoomId = s.RoomId,
                    RoomName = s.Rooms!.Name,
                    RoomType = s.Rooms!.Type,
                    TheaterId = s.Rooms!.TheaterId,
                    TheaterName = s.Rooms!.Theater!.Name,
                    TheaterAddress = s.Rooms!.Theater!.Address,
                    TheaterCity = s.Rooms!.Theater!.City
                })
                .ToListAsync();

            return showtimes;
        }
    }
}
