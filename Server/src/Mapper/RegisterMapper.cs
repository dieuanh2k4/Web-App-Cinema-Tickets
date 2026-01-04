using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Auth;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class RegisterMapper
    {
        public static async Task<User> ToUserFromRegisterDto(this RegisterDto dto)
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
                createdDate = dto.createdDate,
                Address = dto.Address,
                Avatar = dto.Avatar
            };
        }
    }
}