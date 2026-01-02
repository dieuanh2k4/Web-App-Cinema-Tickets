using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Users
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
    }
}