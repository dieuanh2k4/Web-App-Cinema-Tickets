using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Users;
using Server.src.Models;
using Server.src.Utils;

namespace Server.src.Mapper
{
    public static class UserMapper
    {
        public static async Task<User> ToUserFromCreateUserDto(this CreateUserDto createUserDto)
        {
            return new User
            {
                username = createUserDto.username,
                password = PasswordHelper.HashPassword(createUserDto.password), // Hash password using MD5
                createdDate = DateTime.UtcNow
            };
        }
    }
}