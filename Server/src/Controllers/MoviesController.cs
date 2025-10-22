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

        [HttpGet("get-all-movies")]
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

        [HttpGet("get-movie-by-id/{id}")]
        public async Task<IActionResult> GetMovieById([FromQuery] int id)
        {
            try
            {
                var student = _movieService.GetMovieById(id);
                return Ok(student);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPost("create-movie")]
        public async Task<IActionResult> CreateMovie([FromForm] CreateMovieDto movieDto, IFormFile? imageFile)
        {
            try
            {
                if (imageFile != null)
                {
                    var uploadResult = await _movieService.UploadImage(imageFile);
                    movieDto.Thumbnail = uploadResult.SecureUrl.ToString();
                }

                var createdMovie = await _movieService.AddMovie(movieDto);

                await _context.Movies.AddAsync(createdMovie);
                await _context.SaveChangesAsync();

                return Ok(createdMovie);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [HttpPut("add-subject")]
        public async Task<IActionResult> UpdateMovie([FromForm] UpdateMovieDto updateMovieDto, IFormFile? imageFile)
        {
            try
            {
                if (imageFile != null)
                {
                    var uploadResult = await _movieService.UploadImage(imageFile);
                    updateMovieDto.Thumbnail = uploadResult.SecureUrl.ToString();
                }

                var updateMovie = await _movieService.UpdateMovie(updateMovieDto);

                await _context.Movies.AddAsync(updateMovie);
                await _context.SaveChangesAsync();

                return Ok(updateMovie);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
