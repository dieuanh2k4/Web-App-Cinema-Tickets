using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Theater;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class TheaterMapper
    {
        public static TheaterDto ToTheaterDto(this Theater theater)
        {
            return new TheaterDto
            {
                Name = theater.Name,
                City = theater.City,
                Address = theater.Address
            };
        }

        public static async Task<Theater> ToTheaterFromTheaterDto(this CreateTheaterDto createTheaterDto)
        {
            return new Theater
            {
                Name = createTheaterDto.Name,
                City = createTheaterDto.City,
                Address = createTheaterDto.Address
            };
        }
    }
}