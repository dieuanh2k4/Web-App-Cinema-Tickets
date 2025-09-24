using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Movies;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<Movies>> GetAllMovies();
        Movies AddMovie(CreateMovieDto movieDto);
    }
}