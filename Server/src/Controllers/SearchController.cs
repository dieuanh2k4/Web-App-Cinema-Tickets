using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISearchService _searchService;

        public SearchController(ApplicationDbContext context, ISearchService searchMovie, ILogger<SearchController> logger) : base(logger)
        {
            _context = context;
            _searchService = searchMovie;
        }

        [Authorize(Roles = "Staff,Admin,Customer")]
        [HttpGet("search-movie-by-name")]
        public async Task<IActionResult> SearchMovieByName(string movieName)
        {
            try
            {
                var searchMovie = await _searchService.SearchMovieByName(movieName);
                
                return Ok(searchMovie);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Staff,Admin,Customer")]
        [HttpGet("search-theater-by-name")]
        public async Task<IActionResult> SearchTheaterByName(string theaterName)
        {
            try
            {
                var searchTheater = await _searchService.SearchTheaterByName(theaterName);
                
                return Ok(searchTheater);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}