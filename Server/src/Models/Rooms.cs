using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Rooms
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int Capacity { get; set; } // sức chứa

        private string _status = "Trống";
        public string Status
        {
            get => string.IsNullOrEmpty(_status) ? "Trống" : _status;
            set => _status = string.IsNullOrEmpty(value) ? "Trống" : value;
        }
        public int TheaterId { get; set; }

        public Theater? Theater { get; set; }
        public List<Showtimes>? Showtimes { get; set; }
        public List<Seats>? Seats { get; set; }
    }
}