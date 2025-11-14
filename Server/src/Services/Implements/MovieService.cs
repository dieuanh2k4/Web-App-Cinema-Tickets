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
                // mở 1 luồng stream của file bằng OpenReadStream là để xử lý dl nhị phân, tối ưu hóa bộ nhớ và hiệu suất...
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

        public async Task<Movies> AddMovie(CreateMovieDto createmovieDto)
        {
            if (createmovieDto.Title == null)
            {
                throw new Result("Tiêu đề phim không được để trống");
            }

            var checkMovie = _movies.FirstOrDefault(m => m.Title.Equals(createmovieDto.Title, StringComparison.OrdinalIgnoreCase));

            if (checkMovie != null)
            {
                throw new Result($"Phim {createmovieDto.Title} đã tồn tại trong hệ thống");
            }

            if (createmovieDto.EndDate < createmovieDto.StartDate)
            {
                throw new Result("Ngày kết thúc phải nhỏ hơn ngày khởi chiếu");
            }

            if (createmovieDto.Duration <= 0)
            {
                throw new Result("Thời lượng phim phải lớn hơn 0");
            }

            if (createmovieDto.Rating < 0 || createmovieDto.Rating > 10)
            {
                throw new Result("Đánh giá trong khoảng 0-10");
            }

            var newMovie = await createmovieDto.ToMovieFromCreateDto();

            newMovie.Thumbnail = createmovieDto.Thumbnail;

            return newMovie;
        }

        public async Task<Movies> UpdateMovie(UpdateMovieDto updateMovieDto, int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                throw new Result($"Không tìm thấy phim cần chỉnh sửa");
            }

            if (updateMovieDto.EndDate < updateMovieDto.StartDate)
            {
                throw new Result("Ngày kết thúc phải nhỏ hơn ngày khởi chiếu");
            }

            if (updateMovieDto.Duration <= 0)
            {
                throw new Result("Thời lượng phim phải lớn hơn 0");
                // updateMovieDto.Duration = movie.Duration;
            }

            if (updateMovieDto.Rating < 0 || updateMovieDto.Rating > 10)
            {
                throw new Result("Đánh giá trong khoảng 0-10");
                // updateMovieDto.Rating = movie.Rating;
            }

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

            await _context.SaveChangesAsync();

            return movie;
        }

        public async Task<Movies> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                throw new Result("Phim không tồn tại");
            }

            return movie;
        }
        
        // public async Task<Movies> GetMovieByCity(string city)
        // {
        //     var checkCity = await _context.
        // }
    }
}