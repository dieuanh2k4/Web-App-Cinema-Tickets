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
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class MovieService : IMovieService
    {
        private static readonly List<Movies> _movies = new List<Movies>();

        private readonly ApplicationDbContext _context;

        private readonly Cloudinary _cloudinary;

        public MovieService(ApplicationDbContext context, IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
            _context = context;
        }

        public Task<List<Movies>> GetAllMovies()
        {
            return _context.Movies.ToListAsync();
        }

        public async Task<Movies> GetMovieById(int id)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);
            return movie;
        }

        // up ảnh lên cloudinary
        public async Task<ImageUploadResult> UploadImage(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // mỏ stream của file bằng OpenReadStream là để xử lý dl nhị phân, tối ưu hóa bộ nhớ và hiệu suất...
                using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Crop("fill")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<Movies> AddMovie(CreateMovieDto movieDto)
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

            var newMovie = await movieDto.ToMovieFromCreateDto();

            newMovie.Thumbnail = movieDto.Thumbnail;

            return newMovie;
        }

        public async Task<Movies> UpdateMovie(UpdateMovieDto updateMovieDto) 
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == updateMovieDto.Id);

            if (movie == null)
            {
                throw new Result($"Không tìm thấy phim cần chỉnh sửa");
            }

            // var updateMovie = await updateMovieDto.ToMoviesFromUpdateDto();
            
            movie.Title = updateMovieDto.Title;
            movie.Thumbnail = updateMovieDto.Thumbnail;
            movie.Duration = updateMovieDto.Duration;
            movie.Genre = updateMovieDto.Genre;
            movie.Language = updateMovieDto.Language;
            movie.AgeLimit = updateMovieDto.AgeLimit;
            movie.StartDate = updateMovieDto.StartDate;
            movie.Description = updateMovieDto.Description;
            movie.Director = updateMovieDto.Director;
            movie.Actors = updateMovieDto.Actors;
            movie.Rating = updateMovieDto.Rating;

            // await _context.SaveChangesAsync();

            return movie;
        }
    }
}