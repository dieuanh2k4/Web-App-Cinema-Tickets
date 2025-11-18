using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Theater
{
    public class UpdateTheaterDto 
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
    }
}