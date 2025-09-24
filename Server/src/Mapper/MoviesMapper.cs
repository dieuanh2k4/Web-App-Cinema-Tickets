using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Movies;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class MoviesMapper
    {
        public static MovieDto ToMovieDto(this Movies movies)
        {
            return new MovieDto
            {
                Title = movies.Title,
                Thumbnail = movies.Thumbnail,
                Duration = movies.Duration,
                Genre = movies.Genre,
                ReleaseYear = movies.ReleaseYear,
                Description = movies.Description,
                Director = movies.Director,
                Actors = movies.Actors,
                Rating = movies.Rating
            };
        }
        public static Movies ToMovieFromCreateDto(this CreateMovieDto movieDto)
        {
            return new Movies
            {
                Title = movieDto.Title,
                Thumbnail = movieDto.Thumbnail,
                Duration = movieDto.Duration,
                Genre = movieDto.Genre,
                ReleaseYear = movieDto.ReleaseYear,
                Description = movieDto.Description,
                Director = movieDto.Director,
                Actors = movieDto.Actors,
                Rating = movieDto.Rating
            };
        }
    }
}