using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShowtimesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IShowtimeService _showtimeService;

        public ShowtimesController(
            ApplicationDbContext context,
            IShowtimeService showtimeService,
            ILogger<ShowtimesController> logger) : base(logger)
        {
            _context = context;
            _showtimeService = showtimeService;
        }

        [HttpGet("by-movie/{movieId}")]
        public async Task<IActionResult> GetShowtimesByMovie(int movieId)
        {
            try
            {
                var showtimes = await _showtimeService.GetShowtimesByMovieId(movieId);
                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpGet("by-movie/{movieId}/date/{date}")]
        public async Task<IActionResult> GetShowtimesByMovieAndDate(int movieId, string date)
        {
            try
            {
                if (!DateOnly.TryParse(date, out var parsedDate))
                {
                    return BadRequest("Invalid date format. Use YYYY-MM-DD");
                }

                var showtimes = await _showtimeService.GetShowtimesByMovieIdAndDate(movieId, parsedDate);
                return Ok(showtimes);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}