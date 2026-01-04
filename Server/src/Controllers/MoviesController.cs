using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpGet("get-movie-by-id/{id}")]
        public async Task<IActionResult> GetMovieById([FromRoute] int id)
        {
            try
            {
                var student = await _movieService.GetMovieById(id);
                return Ok(student);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("get-all-movies-for-admin")]
        public async Task<IActionResult> GetMovies(
            [FromQuery] string? search = null,
            [FromQuery] int? year = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? status = null,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            try
            {
                var (movies, totalCount) = await _movieService.GetAllMoviesForAdmin(search, year, genre, status, page, limit);
                var movieDtos = movies.Select(m => m.ToMovieDto()).ToList();
                
                return Ok(new
                {
                    data = movieDtos,
                    totalCount = totalCount,
                    page = page,
                    limit = limit,
                    totalPages = (int)Math.Ceiling((double)totalCount / limit)
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-movie")]
        public async Task<IActionResult> CreateMovie([FromForm] CreateMovieDto movieDto, IFormFile? imageFile)
        {
            try
            {
                if (imageFile != null)
                {
                    var imageUrl = await _movieService.UploadImage(imageFile);
                    movieDto.Thumbnail = imageUrl;
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

        [Authorize(Roles = "Admin")]
        [HttpPut("update-subject/{id}")]
        public async Task<IActionResult> UpdateMovie([FromForm] UpdateMovieDto updateMovieDto, IFormFile? imageFile, int id)
        {
            try
            {
                if (imageFile != null)
                {
                    var imageUrl = await _movieService.UploadImage(imageFile);
                    updateMovieDto.Thumbnail = imageUrl;
                }

                var updateMovie = await _movieService.UpdateMovie(updateMovieDto, id);

                return Ok(updateMovie);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-movie/{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            try
            {
                var movie = await _movieService.DeleteMovie(id);

                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();

                return Ok(_movieService);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        
    }
}
