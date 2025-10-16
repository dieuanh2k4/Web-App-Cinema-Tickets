using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.ShowTimes;

namespace Server.src.Services.Interfaces
{
    public interface IShowtimeService
    {
        Task<List<ShowtimeDto>> GetAllShowtimes();
    }
}