using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Users
{
    public class UpdateUserDto
    {
        public string? username { get; set; }
        public string? password { get; set; }
    }
}