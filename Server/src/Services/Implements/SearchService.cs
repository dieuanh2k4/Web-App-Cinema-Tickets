using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class SearchService : ISearchService
    {
        private readonly ApplicationDbContext _context;
        
        public SearchService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Movies>> SearchMovieByName(string movieName)
        {
            if (string.IsNullOrWhiteSpace(movieName))
            {
                return new List<Movies>();
            }

            // Tìm kiếm phim theo tên (không phân biệt hoa thường)
            var movies = await _context.Movies
                .Where(m => m.Title != null && 
                           m.Title.ToLower().Contains(movieName.ToLower()))
                .OrderByDescending(m => m.StartDate)
                .ToListAsync();

            return movies;
        }

        public async Task<List<Theater>> SearchTheaterByName(string movieTheater)
        {
            // Nếu không truyền tên, trả về tất cả rạp (để test)
            if (string.IsNullOrWhiteSpace(movieTheater))
            {
                return await _context.Theater.ToListAsync();
            }

            var theater = await _context.Theater
                .Where(t => t.Name != null && 
                           t.Name.ToLower().Contains(movieTheater.ToLower()))
                .OrderByDescending(t => t.Id)
                .ToListAsync();

            return theater;
        }
    }
}