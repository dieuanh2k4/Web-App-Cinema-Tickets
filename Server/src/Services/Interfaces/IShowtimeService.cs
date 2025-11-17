using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.ShowTimes;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IShowtimeService
    {
        Task<List<ShowtimeDto>> GetAllShowtimes();
        Task<Showtimes> CreateShowtime(CreateShowtimeDto createShowtimeDto, int roomId);
        Task<Showtimes> UpdateShowtime(UpdateShowtimeDto updateShowtimeDto, int roomId, int id);
        Task<Showtimes> DeleteShowtime(int id);
        Task<List<Showtimes>> GetShowtimeByMovie(int theaterId, int movieId, DateOnly date);
        Task<List<ShowtimeDetailDto>> GetShowtimesByMovieId(int movieId);
        Task<List<ShowtimeDetailDto>> GetShowtimesByMovieIdAndDate(int movieId, DateOnly date);
    }
}