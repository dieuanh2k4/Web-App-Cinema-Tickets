using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.ShowTimes;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IShowtimeService
    {
        Task<List<ShowtimeDto>> GetAllShowtimes();
        Task<Showtimes> CreateShowtime(CreateShowtimeDto createShowtimeDto, int roomId);
        Task<Showtimes> UpdateShowtime([FromBody] UpdateShowtimeDto updateShowtimeDto, int roomId, int id);
        Task<Showtimes> DeleteShowtime(int id);
        Task<List<Showtimes>> GetShowtimeByMovie(int theaterId, int movieId, DateOnly date);
    }
}