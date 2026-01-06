using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Admin
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateOnly Birth { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        
        // Phase 2: Support cho Guest vs Registered User
        public int? UserId { get; set; } // null = Guest, có giá trị = Registered User
        public User? User { get; set; } // Navigation property
    }
}