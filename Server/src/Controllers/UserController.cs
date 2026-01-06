using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [Authorize(Roles = "Admin")]
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

        // [Authorize(Roles = "Admin")]
        // [HttpPost("create-user")]
        // public async Task<IActionResult> CreateUser([FromForm] CreateUserDto createUserDto)
        // {
        //     try
        //     {
        //         var newUser = await _userService.CreateUser(createUserDto);

        //         // await _context.User.AddAsync(newUser);
        //         // await _context.SaveChangesAsync();

        //         return Ok(newUser);
        //     }
        //     catch (Exception ex)
        //     {
        //         return ReturnException(ex);
        //     }
        // }

        // [Authorize(Roles = "Admin")]
        // [HttpPut("update-user/{id}")]
        // public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDto updateUserDto, int id)
        // {
        //     try
        //     {
        //         var updateUser = await _userService.UpdateUser(updateUserDto, id);

        //         // await _context.SaveChangesAsync();

        //         return Ok(updateUser);
        //     }
        //     catch (Exception ex)
        //     {
        //         return ReturnException(ex);
        //     }
        // }

        // [Authorize(Roles = "Admin")]
        // [HttpDelete("delete-user/{id}")]
        // public async Task<IActionResult> DeleteUser(int id)
        // {
        //     try
        //     {
        //         var user = await _userService.DeleteUser(id);

        //         // _context.User.Remove(user);
        //         // await _context.SaveChangesAsync();

        //         return Ok(_userService);
        //     }
        //     catch (Exception ex)
        //     {
        //         return ReturnException(ex);
        //     }
        // }

        /// Get current user profile
        [AllowAnonymous]
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var user = await _context.User
                    .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(new
                {
                    id = user.Id,
                    username = user.username,
                    email = user.Email,
                    phoneNumber = user.phoneNumber,
                    createdAt = user.createdDate
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// Get current user's tickets
        [AllowAnonymous]
        [Authorize]
        [HttpGet("tickets")]
        public async Task<IActionResult> GetUserTickets()
        {
            try
            {
                var userId = User.FindFirst("id")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "Unauthorized" });
                }

                var user = await _context.User
                    .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Get tickets by user's email (assuming Customer email matches User email)
                var tickets = await _context.Tickets
                    .Include(t => t.Showtimes)
                        .ThenInclude(s => s.Movies)
                    .Include(t => t.Showtimes)
                        .ThenInclude(s => s.Rooms)
                            .ThenInclude(r => r.Theater)
                    .Include(t => t.User)
                    .Where(t => t.User.Email == user.Email)
                    .OrderByDescending(t => t.Date)
                    .ToListAsync();

                var result = tickets.Select(t => new
                {
                    ticketId = t.Id,
                    bookingCode = t.Id.ToString("D8"),
                    movieTitle = t.Showtimes?.Movies?.Title,
                    movieThumbnail = t.Showtimes?.Movies?.Thumbnail,
                    theaterName = t.Showtimes?.Rooms?.Theater?.Name,
                    roomName = t.Showtimes?.Rooms?.Name,
                    showtime = new DateTime(
                        t.Date.Year,
                        t.Date.Month,
                        t.Date.Day,
                        t.Showtimes?.Start.Hour ?? 0,
                        t.Showtimes?.Start.Minute ?? 0,
                        0
                    ),
                    totalPrice = t.TotalPrice,
                    bookingDate = t.Date
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}