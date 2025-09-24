using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Movies;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;
using Server.src.Controllers;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMovieService _movieService;

        public MoviesController(ApplicationDbContext context, IMovieService movieService, ILogger<MoviesController> logger) : base(logger)
        {
            _context = context;
            _movieService = movieService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies()
        {
            try
            {
                var movies = await _movieService.GetAllMovies();
                var moviedto = movies.Select(m => m.ToMovieDto());
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPost("create-movie")]
        public async Task<IActionResult> CreateMovie([FromBody] CreateMovieDto movieDto)
        {
            try
            {
                var createdMovie = _movieService.AddMovie(movieDto);

                await _context.Movies.AddAsync(createdMovie);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
