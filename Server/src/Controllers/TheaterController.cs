using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
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
            var theater = await _theaterService.GetById(id);
            return Ok(theater);
        }

        [Authorize(Policy = "AdminOnly")]
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

        [Authorize(Policy = "AdminOnly")]
        [HttpPut("update-theater/{id}")]
        public async Task<IActionResult> UpdateTheater([FromBody] UpdateTheaterDto updateTheaterDto, int id)
        {
            try
            {
                var updateTheater = await _theaterService.UpdateTheater(updateTheaterDto, id);

                await _context.Theater.AddAsync(updateTheater);
                await _context.SaveChangesAsync();

                return Ok(updateTheater);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Policy = "AdminOnly")]
        [HttpDelete("delete-theater/{id}")]
        public async Task<IActionResult> DeleteTheater(int id)
        {
            try
            {
                var theater = await _theaterService.DeleteTheater(id);

                _context.Theater.Remove(theater);
                await _context.SaveChangesAsync();

                return Ok(_theaterService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpGet("get-theater-by-city")]
        public async Task<IActionResult> GetTheaterByCity(string city)
        {
            try
            {
                var theater = await _theaterService.GetTheaterByCity(city);

                return Ok(theater);
            } 
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}