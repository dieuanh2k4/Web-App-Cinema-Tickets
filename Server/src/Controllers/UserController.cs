using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Users;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class UserController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;

        public UserController(ApplicationDbContext context, IUserService userService, ILogger<UserController> logger) : base(logger)
        {
            _context = context;
            _userService = userService;
        }

        [HttpGet("get-all-user")]
        public async Task<IActionResult> GetAllUser()
        {
            try
            {
                var user = await _userService.GetAllUsers();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromForm] CreateUserDto createUserDto)
        {
            try
            {
                var newUser = await _userService.CreateUser(createUserDto);

                await _context.User.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPut("update-user/{id}")]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDto updateUserDto, int id)
        {
            try
            {
                var updateUser = await _userService.UpdateUser(updateUserDto, id);

                await _context.SaveChangesAsync();

                return Ok(updateUser);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _userService.DeleteUser(id);

                _context.User.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(_userService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}