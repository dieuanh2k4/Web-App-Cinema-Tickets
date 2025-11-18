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
        Task<Theater> UpdateTheater(UpdateTheaterDto updateTheaterDto, int id);
        Task<Theater> GetById(int id);
        Task<Theater> DeleteTheater(int id);
        Task<List<Theater>> GetTheaterByCity(string city);
    }
}