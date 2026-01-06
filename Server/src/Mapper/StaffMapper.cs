using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Admin;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class StaffMapper
    {
        public static async Task<User> ToUserFromCreateStaffDto(this CreateStaffDto dto)
        {
            return new User
            {
                Name = dto.Name,
                username = dto.username,
                Birth = dto.Birth,
                Gender = dto.Gender,
                Email = dto.Email,
                password = dto.password,
                phoneNumber = dto.phoneNumber,
                createdDate = DateTime.UtcNow,
                Address = dto.Address,
                Avatar = dto.Avatar
            };
        }
    }
}