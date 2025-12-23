using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ISearchService
    {
        Task<List<Movies>> SearchMovieByName(string movieName);
        Task<List<Theater>> SearchTheaterByName(string movieTheater);
    }
}