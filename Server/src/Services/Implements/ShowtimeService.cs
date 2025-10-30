using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.ShowTimes;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class ShowtimeService : IShowtimeService
    {
        private static readonly List<Showtimes> _showtimes = new List<Showtimes>();
        private readonly ApplicationDbContext _context;

        public ShowtimeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ShowtimeDto>> GetAllShowtimes()
        {
            return await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                .Include(s => s.Rooms.Theater)
                .Select(s => new ShowtimeDto
                {
                    Id = s.Id,
                    Start = s.Start,
                    End = s.End,
                    Date = s.Date,
                    MovieTitle = s.Movies.Title,
                    RoomType = s.Rooms.Type,
                    RooomName = s.Rooms.Name,
                    TheaterName = s.Rooms.Theater.Name
                }).ToListAsync();
        }

        public async Task<Showtimes> CreateShowtime(CreateShowtimeDto createShowtimeDto, int roomId)
        {
            var checkroom = await _context.Rooms
                .Include(r => r.Theater)
                .FirstOrDefaultAsync(r => r.Id == roomId);
            
            if (checkroom == null)
            {
                throw new Result("Phòng không tồn tại");
            };

            var duration = await _context.Movies
                .Where(m => m.Id == createShowtimeDto.MovieId)
                .Select(m => m.Duration)
                .FirstOrDefaultAsync();

            createShowtimeDto.End = createShowtimeDto.Start.Add(TimeSpan.FromMinutes(duration)); // chuyển duration sang timespan, sau đó cộng vào start để ra end

            var checkDate = await _context.Showtimes.Select(s => s.Date).ToListAsync();

            if (!checkDate.Contains(createShowtimeDto.Date))
            {
                var showtime = await createShowtimeDto.ToNewShowtime();
                return showtime;
            } 
            else
            {    
                var checkRoom = await _context.Showtimes
                    .Where(s => s.RoomId == roomId)
                    .FirstOrDefaultAsync();

                if (checkRoom == null)
                {
                    var showtime = await createShowtimeDto.ToNewShowtime();
                    return showtime;
                }
                else
                {
                    bool checkShowtime = await _context.Showtimes
                        .Where(s => s.RoomId == roomId)
                        .AnyAsync(s =>
                            (createShowtimeDto.Start >= s.Start && createShowtimeDto.Start < s.End) ||
                            (createShowtimeDto.End > s.Start && createShowtimeDto.End <= s.End) ||
                            (createShowtimeDto.Start <= s.Start && createShowtimeDto.End >= s.End)
                        );

                    if (checkShowtime)
                    {
                        throw new Result("Phòng đã có suất chiếu trùng thời gian và phòng chiếu");
                    }

                    var showtime = await createShowtimeDto.ToNewShowtime();
                    return showtime;
                }
            }
        }
    }
}