using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Server.src.Dtos.Movies;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IMovieService
    {
        Task<(List<Movies> movies, int totalCount)> GetAllMoviesForAdmin(string? search = null, int? year = null, string? genre = null, string? status = null, int page = 1, int limit = 10);
        Task<List<Movies>> GetAllMovies();
        Task<string> UploadImage(IFormFile file);
        Task<Movies> AddMovie(CreateMovieDto movieDto);
        Task<Movies> UpdateMovie(UpdateMovieDto updateMovieDto, int id);
        Task<Movies> GetMovieById(int id);
        Task<Movies> DeleteMovie(int id);
    }
}