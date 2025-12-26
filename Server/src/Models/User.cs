using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public string? email { get; set; }
        public string? phoneNumber { get; set; }
        public int userType { get; set; } // 0 = Admin, 1 = Staff
        public DateTime createdDate { get; set; }
    }
}