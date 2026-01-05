using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Roles
    {
        // [Key]
        public int Id { get; set; }
        
        // [Required]
        // [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        // [MaxLength(255)]
        public string? Description { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedDate { get; set; }
        
        // public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}