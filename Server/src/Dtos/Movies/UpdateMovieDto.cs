using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Movies
{
    public class UpdateMovieDto 
    {
        // public int Id { get; set; }
        public string? Title { get; set; }
        public string? Thumbnail { get; set; } // poster phim
        public int Duration { get; set; } // thời lượng
        public string? Genre { get; set; } // thể loại
        public string? Language { get; set; } // ngôn ngữ
        public string? AgeLimit { get; set; } // giới hạn tuổi
        public int ReleaseYear { get; set; } // năm phát hành
        public DateTime StartDate { get; set; } // ngày khởi chiếu
        public DateTime EndDate { get; set; } // ngày kết thúc
        public string? Description { get; set; } // mô tả
        public string? Director { get; set; } // đạo diễn
        public List<string>? Actors { get; set; } // diễn viên
        public double Rating { get; set; } // đánh giá
    }
}