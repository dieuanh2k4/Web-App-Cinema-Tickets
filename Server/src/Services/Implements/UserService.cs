using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Users;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class UserService : IUserService
    {
        private static readonly List<User> _user = new List<User>();
        private readonly ApplicationDbContext _context;
        
        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.User.ToListAsync();
        }

        public async Task<User> CreateUser([FromForm] CreateUserDto createUserDto)
        {
            var checkUsername = _user.FirstOrDefault(u => u.username.Equals(createUserDto.username, StringComparison.OrdinalIgnoreCase));

            if (checkUsername != null)
            {
                throw new Result($"Tên đăng nhập {createUserDto.username} đã tồn tại. Vui lòng thử tên đăng nhập khác");
            }

            var newUser = await createUserDto.ToUserFromCreateUserDto();

            return newUser;
        }

        public async Task<User> UpdateUser([FromForm] UpdateUserDto updateUserDto, int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                throw new Result("Không tìm thấy tài khoản cần chỉnh sửa");
            }

            user.username = updateUserDto.username;
            
            // Chỉ hash password nếu password mới được cung cấp
            if (!string.IsNullOrEmpty(updateUserDto.password))
            {
                user.password = PasswordHelper.HashPassword(updateUserDto.password);
            }

            return user;
        }
        
        public async Task<User> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                throw new Result("Không tìm thấy user cần xóa");
            }
            else
            {
                return user;
            }
        }
    }
}