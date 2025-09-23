using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private const int MaxPageSize = 50;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/movies
        // Example: /api/movies?q=inception&genre=Sci-Fi&page=1&pageSize=10&sort=release_desc
        [HttpGet]
        public async Task<ActionResult<PagedResult<MovieDto>>> GetMovies(
            [FromQuery] string? q,
            [FromQuery] string? genre,
            [FromQuery] double? minRating,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sort = null)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 10;
            if (pageSize > MaxPageSize) pageSize = MaxPageSize;

            IQueryable<Movies> query = _context.Movies.AsNoTracking();

            // Filter / search
            if (!string.IsNullOrWhiteSpace(q))
            {
                string qLower = q.Trim();
                query = query.Where(m => m.Title.Contains(qLower) 
                                       || (m.Genre != null && m.Genre.Contains(qLower)));
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(m => m.Genre != null && m.Genre == genre);
            }

            if (minRating.HasValue)
            {
                query = query.Where(m => m.Rating >= minRating.Value);
            }

            // Sorting
            query = sort?.ToLower() switch
            {
                "release_desc" => query.OrderByDescending(m => m.ReleaseYear),
                "release_asc" => query.OrderBy(m => m.ReleaseYear),
                "rating_desc" => query.OrderByDescending(m => m.Rating),
                "rating_asc" => query.OrderBy(m => m.Rating),
                _ => query.OrderBy(m => m.Title)
            };

            var total = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MovieDto {
                    Id = m.Id,
                    Title = m.Title,
                    Thumbnail = m.Thumbnail,
                    Duration = m.Duration,
                    Genre = m.Genre,
                    ReleaseYear = m.ReleaseYear,
                    Description = m.Description,
                    Director = m.Director,
                    Rating = m.Rating
                })
                .ToListAsync();

            // Add total count header (useful for frontend pagination)
            Response.Headers["X-Total-Count"] = total.ToString();

            var result = new PagedResult<MovieDto>
            {
                Items = items,
                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return Ok(result);
        }

        // GET: api/movies/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MovieDto>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .AsNoTracking()
                .Where(m => m.Id == id)
                .Select(m => new MovieDto {
                    Id = m.Id,
                    Title = m.Title,
                    Thumbnail = m.Thumbnail,
                    Duration = m.Duration,
                    Genre = m.Genre,
                    ReleaseYear = m.ReleaseYear,
                    Description = m.Description,
                    Director = m.Director,
                    Rating = m.Rating
                })
                .FirstOrDefaultAsync();

            if (movie == null)
                return NotFound(new { message = "Không tìm thấy phim" });

            return Ok(movie);
        }
    }

    // DTO
    public class MovieDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Thumbnail { get; set; }
        public double Duration { get; set; }
        public string? Genre { get; set; }
        public int ReleaseYear { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Director { get; set; }
        public double Rating { get; set; }
    }

    // Paging result
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; } = Array.Empty<T>();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
