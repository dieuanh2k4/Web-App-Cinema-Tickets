using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Tickets
{
    public class CreateTicketDto
    {
        [Required(ErrorMessage = "ShowtimeId là bắt buộc")]
        public int ShowtimeId { get; set; }

        [Required(ErrorMessage = "Thông tin khách hàng là bắt buộc")]
        public CustomerInfoDto? Customer { get; set; }

        [Required(ErrorMessage = "Danh sách ghế là bắt buộc")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 ghế")]
        public List<int>? SeatIds { get; set; }
    }

    public class CustomerInfoDto
    {
        [Required(ErrorMessage = "Tên khách hàng là bắt buộc")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? Phone { get; set; }

        public DateOnly? Birth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }
}
