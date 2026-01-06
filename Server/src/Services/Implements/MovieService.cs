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
        private readonly ApplicationDbContext _context;
        private readonly IMinioStorageService _minioStorage;

        public MovieService(ApplicationDbContext context, IMinioStorageService minioStorage)
        {
            _context = context;
            _minioStorage = minioStorage;
        }

        public async Task<List<Movies>> GetAllMovies()
        {
            var movies = await _context.Movies.ToListAsync();
            
            // Chuyển path thành URL cho từng movie
            foreach (var movie in movies)
            {
                if (!string.IsNullOrEmpty(movie.Thumbnail))
                {
                    movie.Thumbnail = _minioStorage.GetImageUrl(movie.Thumbnail);
                }
                // if (!string.IsNullOrEmpty(movie.BackdropUrl))
                // {
                //     movie.BackdropUrl = _minioStorage.GetImageUrl(movie.BackdropUrl);
                // }
            }
            
            return movies;
        }

        public async Task<(List<Movies> movies, int totalCount)> GetAllMoviesForAdmin(
            string? search = null, 
            int? year = null, 
            string? genre = null, 
            string? status = null, 
            int page = 1, 
            int limit = 10)
        {
            var query = _context.Movies.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(m => m.Title.Contains(search) || 
                                        m.Description.Contains(search) ||
                                        m.Director.Contains(search));
            }

            // Apply year filter
            if (year.HasValue)
            {
                query = query.Where(m => m.ReleaseYear == year.Value);
            }

            // Apply genre filter
            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(m => m.Genre.Contains(genre));
            }

            // Apply status filter
            if (!string.IsNullOrWhiteSpace(status))
            {
                var today = DateTime.Today;
                query = status.ToLower() switch
                {
                    "sắp chiếu" => query.Where(m => today < m.StartDate),
                    "ngừng chiếu" => query.Where(m => today > m.EndDate),
                    "đang chiếu" => query.Where(m => today >= m.StartDate && today <= m.EndDate),
                    _ => query
                };
            }

            // Get total count before pagination
            var totalCount = await query.CountAsync();

            // Apply pagination
            var movies = await query
                .OrderByDescending(m => m.StartDate)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Chuyển path thành URL cho từng movie
            foreach (var movie in movies)
            {
                if (!string.IsNullOrEmpty(movie.Thumbnail))
                {
                    movie.Thumbnail = _minioStorage.GetImageUrl(movie.Thumbnail);
                    // Chuyển path thành URL
                    if (movie != null)
                    {
                        if (!string.IsNullOrEmpty(movie.Thumbnail))
                        {
                            movie.Thumbnail = _minioStorage.GetImageUrl(movie.Thumbnail);
                        }
                        // if (!string.IsNullOrEmpty(movie.BackdropUrl))
                        // {
                        //     movie.BackdropUrl = _minioStorage.GetImageUrl(movie.BackdropUrl);
                        // }
                    }
                }
                // if (!string.IsNullOrEmpty(movie.BackdropUrl))
                // {
                //     movie.BackdropUrl = _minioStorage.GetImageUrl(movie.BackdropUrl);
                // }
            }

            return (movies, totalCount);
        }

        public async Task<Movies> GetMovieById(int id)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id);
            
            // Chuyển path thành URL
            if (movie != null && !string.IsNullOrEmpty(movie.Thumbnail))
            {
                movie.Thumbnail = _minioStorage.GetImageUrl(movie.Thumbnail);
            }
            
            return movie;
        }

        // Upload ảnh lên MinIO
        public async Task<string> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File không hợp lệ");
            }

            // Upload lên MinIO với folder "movies"
            // Trả về path để lưu vào DB: cinebook/movies/abc.jpg
            var fileName = await _minioStorage.UploadImageAsync(file, "movies");
            
            return fileName;
        }

        public async Task<Movies> AddMovie(CreateMovieDto createmovieDto)
        {
            if (createmovieDto.Title == null)
            {
                throw new Result("Tiêu đề phim không được để trống");
            }

            // Kiểm tra trong database - dùng ToLower() thay vì StringComparison
            var checkMovie = await _context.Movies
                .FirstOrDefaultAsync(m => m.Title.ToLower() == createmovieDto.Title.ToLower());

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

            await _context.Movies.AddAsync(newMovie);
            await _context.SaveChangesAsync();

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
            movie.ReleaseYear = updateMovieDto.ReleaseYear;
            movie.StartDate = updateMovieDto.StartDate;
            movie.EndDate = updateMovieDto.EndDate;
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