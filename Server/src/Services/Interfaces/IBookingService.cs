using System.Collections.Generic;
using System.Threading.Tasks;
using Server.src.Dtos.Booking;

namespace Server.src.Services.Interfaces
{
    public interface IBookingService
    {
        /// <summary>
        /// Guest đặt vé (không cần đăng nhập)
        /// </summary>
        Task<BookingResponseDto> CreateGuestBookingAsync(CreateBookingDto dto);
        
        /// <summary>
        /// Staff tạo vé tại quầy (thanh toán tiền mặt)
        /// </summary>
        Task<BookingResponseDto> CreateStaffBookingAsync(StaffBookingDto dto, int staffId);
        
        /// <summary>
        /// Lấy danh sách ghế khả dụng cho suất chiếu
        /// </summary>
        Task<List<int>> GetAvailableSeatsAsync(int showtimeId);
        
        /// <summary>
        /// Tính tổng tiền
        /// </summary>
        Task<decimal> CalculateTotalAmountAsync(List<int> seatIds, int showtimeId);
    }
}
