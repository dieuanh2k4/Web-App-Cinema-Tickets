using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Movies
{
    public class MovieDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Thumbnail { get; set; }
        public double Duration { get; set; }
        public string? Genre { get; set; }
        public int ReleaseYear { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? Director { get; set; }
        public List<string>? Actors { get; set; }
        public double Rating { get; set; }
    }
}