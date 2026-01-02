using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class User
    {
        // [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? username { get; set; }
        public DateOnly Birth { get; set; }
        public string? Gender { get; set; }
        public string? Email { get; set; }
        public string? password { get; set; }
        public string? phoneNumber { get; set; }
        public DateTime createdDate { get; set; }
        public string? Address { get; set; }
        public string? Avatar { get; set; }
        
        // public bool IsActive { get; set; } = true;
        
        // Navigation properties - Kết nối với Role thông qua UserRole
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}