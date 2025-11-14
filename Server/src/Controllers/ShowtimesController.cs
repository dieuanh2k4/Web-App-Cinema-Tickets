using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.ShowTimes;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IShowtimeService _showtimeService;

        public ShowtimesController(ApplicationDbContext context, IShowtimeService showtimeService, ILogger<ShowtimesController> logger) : base(logger)
        {
            _context = context;
            _showtimeService = showtimeService;
        }

        [HttpGet("get_all_showtime")]
        public async Task<IActionResult> GetShowtime()
        {
            try
            {
                var showtimes = await _showtimeService.GetAllShowtimes();

                if (showtimes == null || showtimes.Count() == 0)
                {
                    return NotFound("Không có suất chiếu nào.");
                }

                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPost("create-showtimes")]
        public async Task<IActionResult> CreateShowtime([FromBody] CreateShowtimeDto createShowtimeDto, int roomId)
        {
            try
            {
                var showtime = await _showtimeService.CreateShowtime(createShowtimeDto, roomId);

                await _context.AddAsync(showtime);
                await _context.SaveChangesAsync();

                return Ok(showtime);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPut("update-showtime/{id}")]
        public async Task<IActionResult> UpdateShowtime([FromBody] UpdateShowtimeDto updateShowtimeDto, int roomId, int id)
        {
            try
            {
                var showtime = await _showtimeService.UpdateShowtime(updateShowtimeDto, roomId, id);

                await _context.SaveChangesAsync();

                return Ok(showtime);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpDelete("delete-showtime/{id}")]
        public async Task<IActionResult> DeleteShowtime(int id)
        {
            try
            {
                var showtime = await _showtimeService.DeleteShowtime(id);

                _context.Showtimes.Remove(showtime);
                await _context.SaveChangesAsync();

                return Ok(_showtimeService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpGet("get-showtime-by-movieId")]
        public async Task<IActionResult> GetShowtimeByMovie(int theaterId, int movieId, DateOnly date)
        {
             try
            {
                var showtimes = await _showtimeService.GetShowtimeByMovie(theaterId, movieId, date);

                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}