using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Constant;

namespace Server.src.Dtos.Users
{
    public class UpdateUserDto
    {
        public string? username { get; set; }
        public string? password { get; set; }
        [RegularExpression($"^({UserTypes.Admin}|{UserTypes.Staff}|{UserTypes.Customer})$", ErrorMessage = $"Quyền bắt buộc phải là '{UserTypes.Admin}', '{UserTypes.Staff}', hoặc '{UserTypes.Customer}'.")]
        public string? userType { get; set; }
    }
}