using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.Users;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<User>> GetAllUsers();
        Task<User> CreateUser([FromForm] CreateUserDto createUserDto);
        Task<User> UpdateUser([FromForm] UpdateUserDto updateUserDto, int id);
        Task<User> DeleteUser(int id);
    }
}