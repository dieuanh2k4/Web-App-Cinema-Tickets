using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Movies
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Thumbnail { get; set; } // poster phim
        public double Duration { get; set; } // thời lượng
        public string? Genre { get; set; } // thể loại
        public int RealeaseYear { get; set; } // năm phát hành
        public string? Description { get; set; } // mô tả
        public string? Director { get; set; } // đạo diễn
        public List<string>? Actors { get; set; } // diễn viên
        public double Rating { get; set; } // đánh giá
        
        public ICollection<Showtimes>? Showtimes { get; set; }
    }
}