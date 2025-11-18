using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Movies
{
    public class CreateMovieDto
    {
        public string? Title { get; set; } = null;
        public string? Thumbnail { get; set; } = null;// poster phim
        public int Duration { get; set; } = 0; // thời lượng
        public string? Genre { get; set; } = null;// thể loại
        public string? Language { get; set; } = null;// ngôn ngữ
        public string? AgeLimit { get; set; } = null;// giới hạn tuổi
        public DateTime StartDate { get; set; } // ngày khởi chiếu
        public DateTime EndDate { get; set; } // ngày kết thúc
        public string? Description { get; set; } = null; // mô tả
        public string? Director { get; set; } = null;// đạo diễn
        public List<string>? Actors { get; set; } = null;// diễn viên
        public double Rating { get; set; } = 0;// đánh giá
    }
}