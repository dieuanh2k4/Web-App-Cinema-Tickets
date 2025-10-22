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
        Task<List<Movies>> GetAllMovies();
        Task<ImageUploadResult> UploadImage(IFormFile file);
        Task<Movies> AddMovie(CreateMovieDto movieDto);
        Task<Movies> UpdateMovie(UpdateMovieDto updateMovieDto);
    }
}