using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateOnly Birth { get; set; }
        public string? gender { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }
}