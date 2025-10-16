using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
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
    }
}