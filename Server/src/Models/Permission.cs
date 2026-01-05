using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Permission
    {
        // [Key]
        public int Id { get; set; }
        
        // [Required]
        // [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        // [Required]
        // [MaxLength(100)]
        public string Code { get; set; } = string.Empty; // Unique code like "USER_CREATE", "MOVIE_UPDATE"
        
        // [MaxLength(255)]
        public string? Description { get; set; }
        
        // [MaxLength(50)]
        public string? Module { get; set; } // Module nhóm: User, Movie, Booking, etc.
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}
