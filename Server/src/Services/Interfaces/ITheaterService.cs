using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Theater;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ITheaterService
    {
        Task<List<Theater>> GetAllTheaters();
        Task<Theater> AddTheater(CreateTheaterDto createTheaterDto);
    }
}