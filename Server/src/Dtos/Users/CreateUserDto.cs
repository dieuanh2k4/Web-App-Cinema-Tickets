using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Users
{
    public class CreateUserDto
    {
        private string? _username;

        [Required]
        [StringLength(20, ErrorMessage = "Tên tài khoản dài từ 3 đến 20 kí tự", MinimumLength = 3)]
        public string? username
        {
            get => _username;
            set => _username = value?.Trim();
        }

        [Required]
        [StringLength(20, ErrorMessage = "Mật khẩu dài từ 5 đến 20 kí tự", MinimumLength = 5)]
        public string? password { get; set; }
    }
}