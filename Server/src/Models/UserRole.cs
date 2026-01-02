using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    // Bảng trung gian kết nối User và Role (Many-to-Many)
    public class UserRole
    {
        // [Key]
        public int Id { get; set; }
        
        // [Required]
        public int UserId { get; set; }
        
        // [Required]
        public int RoleId { get; set; }
        
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        
        public int? AssignedByUserId { get; set; } // User nào gán role này
        
        // Navigation properties
        // [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        
        // [ForeignKey("RoleId")]
        public Roles Role { get; set; } = null!;
    }
}
