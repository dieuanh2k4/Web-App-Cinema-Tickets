using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Theater;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class TheaterService : ITheaterService
    {
        private static readonly List<Theater> _theater = new List<Theater>();
        private readonly ApplicationDbContext _context;

        public TheaterService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<List<Theater>> GetAllTheaters()
        {
            return _context.Theater.ToListAsync();
        }

        public async Task<Theater> AddTheater(CreateTheaterDto createTheaterDto)
        {
            if (createTheaterDto.Name == null)
            {
                throw new Result("Tên rạp không được để trống");
            }

            var checkTheater = _theater.FirstOrDefault(t => t.Name.Equals(createTheaterDto.Name, StringComparison.OrdinalIgnoreCase));

            if (checkTheater != null)
            {
                throw new Result($"Rạp {createTheaterDto.Name} đã tồn tại");
            }

            var newTheater = await createTheaterDto.ToTheaterFromTheaterDto();

            return newTheater;
        }
    }
}