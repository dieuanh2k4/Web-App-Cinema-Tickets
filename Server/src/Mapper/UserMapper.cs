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
            // Convert string userType to int: "Admin" -> 0, "Staff" -> 1, default -> 1
            int userTypeInt = createUserDto.userType?.ToLower() == "admin" ? 0 : 1;
            
            return new User
            {
                username = createUserDto.username,
                password = PasswordHelper.HashPassword(createUserDto.password), // Hash password using MD5
                userType = userTypeInt
            };
        }
    }
}