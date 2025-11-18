using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Movies;
using Server.src.Models;
using Server.src.Services.Implements;
using Server.src.Services.Interfaces;

namespace Server.src.Mapper
{
    public static class MoviesMapper
    {
        // private static readonly IMovieService _movieService;

        // public static MoviesController(IMovieService movieService)
        // {
        //     _movieService = movieService;
        // }

        public static MovieDto ToMovieDto(this Movies movies)
        {
            return new MovieDto
            {
                Title = movies.Title,
                Thumbnail = movies.Thumbnail,
                Duration = movies.Duration,
                Genre = movies.Genre,
                Language = movies.Language,
                AgeLimit = movies.AgeLimit,
                StartDate = movies.StartDate,
                Description = movies.Description,
                Director = movies.Director,
                Actors = movies.Actors,
                Rating = movies.Rating
            };
        }
        public static async Task<Movies> ToMovieFromCreateDto(this CreateMovieDto movieDto)
        {
            return new Movies
            {
                Title = movieDto.Title,
                Thumbnail = movieDto.Thumbnail,
                Duration = movieDto.Duration,
                Genre = movieDto.Genre,
                Language = movieDto.Language,
                AgeLimit = movieDto.AgeLimit,
                StartDate = movieDto.StartDate,
                Description = movieDto.Description,
                Director = movieDto.Director,
                Actors = movieDto.Actors,
                Rating = movieDto.Rating
            };
        }

        // public static async Task<Movies> ToMoviesFromUpdateDto(this UpdateMovieDto updateMovieDto)
        // {
        //     return new Movies
        //     {
        //         Title = updateMovieDto.Title,
        //         Thumbnail = updateMovieDto.Thumbnail,
        //         Duration = updateMovieDto.Duration,
        //         Genre = updateMovieDto.Genre,
        //         Language = updateMovieDto.Language,
        //         AgeLimit = updateMovieDto.AgeLimit,
        //         StartDate = updateMovieDto.StartDate,
        //         Description = updateMovieDto.Description,
        //         Director = updateMovieDto.Director,
        //         Actors = updateMovieDto.Actors,
        //         Rating = updateMovieDto.Rating
        //     };
        // }
    }
}