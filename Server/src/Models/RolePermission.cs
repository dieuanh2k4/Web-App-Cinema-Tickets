using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    // Bảng trung gian kết nối Role và Permission (Many-to-Many)
    public class RolePermission
    {
        // [Key]
        public int Id { get; set; }
        
        // [Required]
        public int RoleId { get; set; }
        
        // [Required]
        public int PermissionId { get; set; }
        
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        // [ForeignKey("RoleId")]
        public Roles Role { get; set; } = null!;
        
        // [ForeignKey("PermissionId")]
        public Permission Permission { get; set; } = null!;
    }
}
