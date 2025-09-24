using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Movies;
using Server.src.Models;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Data;
using Server.src.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Server.src.Services.Implements
{
    public class MovieService : IMovieService
    {
        private static readonly List<Movies> _movies = new List<Movies>();

        private readonly ApplicationDbContext _context;

        public MovieService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<List<Movies>> GetAllMovies()
        {
            return _context.Movies.ToListAsync();
        }

        public Movies AddMovie(CreateMovieDto movieDto)
        {
            if (movieDto.Title == null)
            {
                throw new Result("Tiêu đề phim không được để trống");
            }

            var checkMovie = _movies.FirstOrDefault(m => m.Title.Equals(movieDto.Title, StringComparison.OrdinalIgnoreCase));

            if (checkMovie != null)
            {
                throw new Result($"Phim {movieDto.Title} đã tồn tại trong hệ thống");
            }

            var newMovie = movieDto.ToMovieFromCreateDto();

            return newMovie;
        }
    }
}