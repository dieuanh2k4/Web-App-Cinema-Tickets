using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Theater;
using Server.src.Mapper;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheaterController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITheaterService _theaterService;

        public TheaterController(ApplicationDbContext context, ITheaterService theaterService, ILogger<TheaterController> logger) : base(logger)
        {
            _context = context;
            _theaterService = theaterService;
        }

        [HttpGet("get-all-theater")]
        public async Task<IActionResult> GetTheaters()
        {
            try
            {
                var theaters = await _theaterService.GetAllTheaters();
                var theaterDto = theaters.Select(t => t.ToTheaterDto());

                return Ok(theaters);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpGet("get-theater-by-id/{id}")]
        public async Task<IActionResult> GetTheaterById([FromQuery] int id)
        {
            var theater = _theaterService.GetById(id);
            return Ok(theater);
        }

        [HttpPost("create-theater")]
        public async Task<IActionResult> CreateTheater([FromBody] CreateTheaterDto createTheaterDto)
        {
            try
            {
                var createTheater = await _theaterService.AddTheater(createTheaterDto);

                await _context.Theater.AddAsync(createTheater);
                await _context.SaveChangesAsync();

                return Ok(createTheater);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPut("update-theater")]
        public async Task<IActionResult> UpdateTheater([FromBody] UpdateTheaterDto updateTheaterDto)
        {
            try
            {
                var updateTheater = await _theaterService.UpdateTheater(updateTheaterDto);

                await _context.Theater.AddAsync(updateTheater);
                await _context.SaveChangesAsync();

                return Ok(updateTheater);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}