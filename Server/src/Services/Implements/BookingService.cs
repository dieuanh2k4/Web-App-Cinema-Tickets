using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Booking;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customerService;

        public BookingService(ApplicationDbContext context, ICustomerService customerService)
        {
            _context = context;
            _customerService = customerService;
        }

        public async Task<BookingResponseDto> CreateGuestBookingAsync(CreateBookingDto dto)
        {
            // 1. Tìm hoặc tạo Customer
            var customer = await _customerService.FindOrCreateByPhoneAsync(
                dto.PhoneNumber, 
                dto.CustomerName, 
                dto.Email
            );

            // 2. Lấy thông tin Showtime
            var showtime = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId)
                ?? throw new Exception("Suất chiếu không tồn tại");

            // 3. Kiểm tra ghế còn trống
            var bookedSeats = await GetBookedSeatsAsync(dto.ShowtimeId);
            var invalidSeats = dto.SeatIds.Intersect(bookedSeats).ToList();
            if (invalidSeats.Any())
            {
                throw new Exception($"Ghế {string.Join(", ", invalidSeats)} đã được đặt");
            }

            // 4. Tính tổng tiền
            var totalAmount = await CalculateTotalAmountAsync(dto.SeatIds, dto.ShowtimeId);

            // 5. Tạo Tickets (mỗi ghế 1 ticket)
            var tickets = new List<Ticket>();
            foreach (var seatId in dto.SeatIds)
            {
                var ticket = new Ticket
                {
                    ShowtimeId = dto.ShowtimeId,
                    CustomerId = customer.Id,
                    SeatId = seatId,
                    RoomId = showtime.RoomId,
                    MovieId = showtime.MovieId,
                    SumOfSeat = dto.SeatIds.Count,
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    TotalPrice = (int)totalAmount
                };
                tickets.Add(ticket);
            }

            await _context.Ticket.AddRangeAsync(tickets);

            // 6. Tạo Payment
            var payment = new Payment
            {
                TicketId = tickets.First().Id,
                paymentMethod = dto.PaymentMethod,
                TotalPrice = (int)totalAmount,
                Date = DateOnly.FromDateTime(DateTime.Now),
                Status = dto.PaymentMethod == "Cash" ? "Pending" : "Pending"
            };

            await _context.Payment.AddAsync(payment);
            await _context.SaveChangesAsync();

            // 7. Tạo booking code
            var bookingCode = $"BK{DateTime.Now:yyyyMMddHHmmss}{customer.Id}";

            // 8. Lấy danh sách số ghế
            var seats = await _context.Seats
                .Where(s => dto.SeatIds.Contains(s.Id))
                .Select(s => s.Name ?? "")
                .ToListAsync();

            // 9. Chuyển TimeOnly sang DateTime để trả về
            var showtimeDateTime = showtime.Date.ToDateTime(showtime.Start);

            return new BookingResponseDto
            {
                TicketId = tickets.First().Id,
                BookingCode = bookingCode,
                ShowtimeId = dto.ShowtimeId,
                MovieTitle = showtime.Movies?.Title ?? "",
                ShowtimeStart = showtimeDateTime,
                RoomName = showtime.Rooms?.Name ?? "",
                SeatNumbers = seats,
                TotalAmount = totalAmount,
                PaymentMethod = dto.PaymentMethod,
                PaymentStatus = "Pending"
            };
        }

        public async Task<BookingResponseDto> CreateStaffBookingAsync(StaffBookingDto dto, int staffId)
        {
            var customer = await _customerService.FindOrCreateByPhoneAsync(
                dto.CustomerPhone,
                dto.CustomerName
            );

            var showtime = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId)
                ?? throw new Exception("Suất chiếu không tồn tại");

            var bookedSeats = await GetBookedSeatsAsync(dto.ShowtimeId);
            var invalidSeats = dto.SeatIds.Intersect(bookedSeats).ToList();
            if (invalidSeats.Any())
            {
                throw new Exception($"Ghế {string.Join(", ", invalidSeats)} đã được đặt");
            }

            var totalAmount = await CalculateTotalAmountAsync(dto.SeatIds, dto.ShowtimeId);

            var tickets = new List<Ticket>();
            foreach (var seatId in dto.SeatIds)
            {
                var ticket = new Ticket
                {
                    ShowtimeId = dto.ShowtimeId,
                    CustomerId = customer.Id,
                    SeatId = seatId,
                    RoomId = showtime.RoomId,
                    MovieId = showtime.MovieId,
                    SumOfSeat = dto.SeatIds.Count,
                    Date = DateOnly.FromDateTime(DateTime.Now),
                    TotalPrice = (int)totalAmount
                };
                tickets.Add(ticket);
            }

            await _context.Ticket.AddRangeAsync(tickets);

            // Payment đã thanh toán
            var payment = new Payment
            {
                TicketId = tickets.First().Id,
                paymentMethod = "Cash",
                TotalPrice = (int)totalAmount,
                Date = DateOnly.FromDateTime(DateTime.Now),
                Status = "Paid"
            };

            await _context.Payment.AddAsync(payment);
            await _context.SaveChangesAsync();

            var bookingCode = $"BK{DateTime.Now:yyyyMMddHHmmss}{customer.Id}";

            var seats = await _context.Seats
                .Where(s => dto.SeatIds.Contains(s.Id))
                .Select(s => s.Name ?? "")
                .ToListAsync();

            decimal? changeAmount = null;
            if (dto.PaidAmount.HasValue)
            {
                changeAmount = dto.PaidAmount.Value - totalAmount;
            }

            var showtimeDateTime = showtime.Date.ToDateTime(showtime.Start);

            return new BookingResponseDto
            {
                TicketId = tickets.First().Id,
                BookingCode = bookingCode,
                ShowtimeId = dto.ShowtimeId,
                MovieTitle = showtime.Movies?.Title ?? "",
                ShowtimeStart = showtimeDateTime,
                RoomName = showtime.Rooms?.Name ?? "",
                SeatNumbers = seats,
                TotalAmount = totalAmount,
                PaymentMethod = "Cash",
                PaymentStatus = "Paid",
                PaidAmount = dto.PaidAmount,
                ChangeAmount = changeAmount
            };
        }

        public async Task<List<int>> GetAvailableSeatsAsync(int showtimeId)
        {
            var showtime = await _context.Showtimes
                .Include(s => s.Rooms)
                .FirstOrDefaultAsync(s => s.Id == showtimeId)
                ?? throw new Exception("Suất chiếu không tồn tại");

            var allSeats = await _context.Seats
                .Where(s => s.RoomId == showtime.RoomId)
                .Select(s => s.Id)
                .ToListAsync();

            var bookedSeats = await GetBookedSeatsAsync(showtimeId);

            return allSeats.Except(bookedSeats).ToList();
        }

        public async Task<decimal> CalculateTotalAmountAsync(List<int> seatIds, int showtimeId)
        {
            // TODO: Tính theo giá vé thực tế (TicketPrice)
            // Tạm thời cố định 100,000 VND/ghế
            return seatIds.Count * 100000;
        }

        private async Task<List<int>> GetBookedSeatsAsync(int showtimeId)
        {
            return await _context.Ticket
                .Where(t => t.ShowtimeId == showtimeId)
                .Select(t => t.SeatId)
                .Distinct()
                .ToListAsync();
        }
    }
}
