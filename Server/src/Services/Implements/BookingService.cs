using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Booking;
using Server.src.Models;
using Server.src.Services.Interfaces;
using StackExchange.Redis;

namespace Server.src.Services.Implements
{
    public class BookingService : IBookingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICustomerService _customerService;
        private readonly IConnectionMultiplexer _redis;

        public BookingService(
            ApplicationDbContext context, 
            ICustomerService customerService,
            IConnectionMultiplexer redis)
        {
            _context = context;
            _customerService = customerService;
            _redis = redis;
        }

        public async Task<BookingResponseDto> CreateGuestBookingAsync(CreateBookingDto dto)
        {
            try
            {
                // DEBUG: Log ShowtimeId
                Console.WriteLine($"[BookingService] CreateGuestBookingAsync - ShowtimeId: {dto.ShowtimeId} (Type: {dto.ShowtimeId.GetType().Name})");
                
                // 1. Validate showtime
                var showtime = await _context.Showtimes
                    .Include(s => s.Movies)
                    .Include(s => s.Rooms)
                        .ThenInclude(r => r!.Theater)
                    .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId);

                if (showtime == null)
                    throw new ArgumentException("Suất chiếu không tồn tại");

                // 2. Validate seats
                var seats = await _context.Seats
                    .Where(s => dto.SeatIds.Contains(s.Id))
                    .ToListAsync();

                if (seats.Count != dto.SeatIds.Count)
                    throw new ArgumentException("Một số ghế không tồn tại");

                // Kiểm tra ghế có thuộc phòng không
                var invalidSeats = seats.Where(s => s.RoomId != showtime.RoomId).ToList();
                if (invalidSeats.Any())
                    throw new ArgumentException($"Ghế {string.Join(", ", invalidSeats.Select(s => s.Name))} không thuộc phòng này");

                // 3. Kiểm tra ghế đã được đặt chưa
                var bookedSeatIds = await _context.StatusSeat
                    .Where(ss => dto.SeatIds.Contains(ss.SeatId)
                              && ss.ShowtimeId == dto.ShowtimeId
                              && (ss.Status == "Booked" || ss.Status == "Pending"))
                    .Select(ss => ss.SeatId)
                    .ToListAsync();

                if (bookedSeatIds.Any())
                {
                    var bookedSeatNames = await _context.Seats
                        .Where(s => bookedSeatIds.Contains(s.Id))
                        .Select(s => s.Name)
                        .ToListAsync();
                    throw new ArgumentException($"Ghế {string.Join(", ", bookedSeatNames)} đã được đặt");
                }

                // 4. Tìm hoặc tạo customer
                var customer = await _customerService.FindOrCreateByPhoneAsync(
                    dto.PhoneNumber,
                    dto.CustomerName,
                    dto.Email
                );

                // 5. Tính tổng tiền dựa trên Seats.Price
                int totalAmount = (int)seats.Sum(s => s.Price);

                // 6. Tạo Ticket với TicketSeats
                var ticket = new Ticket
                {
                    UserId = customer.Id,
                    ShowtimeId = dto.ShowtimeId,
                    RoomId = showtime.RoomId,
                    MovieId = showtime.MovieId,
                    TotalPrice = totalAmount,
                    Date = showtime.Date,
                    SumOfSeat = seats.Count
                };

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                // 6.1. Tạo TicketSeats cho từng ghế
                var ticketSeats = seats.Select(seat => new TicketSeat
                {
                    TicketId = ticket.Id,
                    SeatId = seat.Id
                }).ToList();

                _context.TicketSeats.AddRange(ticketSeats);
                await _context.SaveChangesAsync();

                // 7. Tạo Payment
                var payment = new Payment
                {
                    TicketId = ticket.Id,
                    TotalPrice = totalAmount,
                    paymentMethod = dto.PaymentMethod,
                    Date = showtime.Date,
                    Status = "Chưa Thanh toán" // Chờ xác nhận thanh toán
                };

                _context.Payment.Add(payment);

                // 8. Cập nhật StatusSeat
                var statusSeats = seats.Select(seat => new StatusSeat
                {
                    SeatId = seat.Id,
                    ShowtimeId = dto.ShowtimeId,
                    Status = "Pending" // Chờ thanh toán
                }).ToList();

                _context.StatusSeat.AddRange(statusSeats);
                await _context.SaveChangesAsync();

                // 9. Return response
                return new BookingResponseDto
                {
                    TicketId = ticket.Id,
                    BookingCode = ticket.Id.ToString("D8"),
                    ShowtimeId = dto.ShowtimeId,
                    MovieTitle = showtime.Movies!.Title!,
                    RoomName = showtime.Rooms!.Name!,
                    ShowtimeStart = new DateTime(
                        showtime.Date.Year,
                        showtime.Date.Month,
                        showtime.Date.Day,
                        showtime.Start.Hour,
                        showtime.Start.Minute,
                        showtime.Start.Second
                    ),
                    SeatNumbers = seats.Select(s => s.Name!).ToList(),
                    TotalAmount = totalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    PaymentStatus = "Pending"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateGuestBookingAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<BookingResponseDto> CreateStaffBookingAsync(StaffBookingDto dto, int staffUserId)
        {
            try
            {
                // 1. Validate showtime
                var showtime = await _context.Showtimes
                    .Include(s => s.Movies)
                    .Include(s => s.Rooms)
                        .ThenInclude(r => r!.Theater)
                    .FirstOrDefaultAsync(s => s.Id == dto.ShowtimeId);

                if (showtime == null)
                    throw new ArgumentException("Suất chiếu không tồn tại");

                // 2. Validate seats
                var seats = await _context.Seats
                    .Where(s => dto.SeatIds.Contains(s.Id))
                    .ToListAsync();

                if (seats.Count != dto.SeatIds.Count)
                    throw new ArgumentException("Một số ghế không tồn tại");

                var invalidSeats = seats.Where(s => s.RoomId != showtime.RoomId).ToList();
                if (invalidSeats.Any())
                    throw new ArgumentException($"Ghế {string.Join(", ", invalidSeats.Select(s => s.Name))} không thuộc phòng này");

                // 3. Kiểm tra ghế đã được đặt chưa
                var bookedSeatIds = await _context.StatusSeat
                    .Where(ss => dto.SeatIds.Contains(ss.SeatId)
                              && ss.ShowtimeId == dto.ShowtimeId
                              && (ss.Status == "Booked" || ss.Status == "Pending"))
                    .Select(ss => ss.SeatId)
                    .ToListAsync();

                if (bookedSeatIds.Any())
                {
                    var bookedSeatNames = await _context.Seats
                        .Where(s => bookedSeatIds.Contains(s.Id))
                        .Select(s => s.Name)
                        .ToListAsync();
                    throw new ArgumentException($"Ghế {string.Join(", ", bookedSeatNames)} đã được đặt");
                }

                // 4. Tìm hoặc tạo customer
                var customer = await _customerService.FindOrCreateByPhoneAsync(
                    dto.CustomerPhone,
                    dto.CustomerName,
                    dto.Email // Email có thể null
                );

                // 5. Tính tổng tiền
                int totalAmount = (int)seats.Sum(s => s.Price);

                // 6. Validate paid amount (chỉ cho Cash)
                if (dto.PaymentMethod == "Cash" && dto.PaidAmount.HasValue && dto.PaidAmount < totalAmount)
                    throw new ArgumentException($"Số tiền khách đưa ({dto.PaidAmount:N0}đ) không đủ. Tổng tiền: {totalAmount:N0}đ");

                // 7. Tạo Ticket với TicketSeats
                var ticket = new Ticket
                {
                    UserId = customer.Id,
                    ShowtimeId = dto.ShowtimeId,
                    RoomId = showtime.RoomId,
                    MovieId = showtime.MovieId,
                    TotalPrice = totalAmount,
                    Date = showtime.Date,
                    SumOfSeat = seats.Count
                };

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                // 7.1. Tạo TicketSeats cho từng ghế
                var ticketSeats = seats.Select(seat => new TicketSeat
                {
                    TicketId = ticket.Id,
                    SeatId = seat.Id
                }).ToList();

                _context.TicketSeats.AddRange(ticketSeats);
                await _context.SaveChangesAsync();

                // 8. Tạo Payment
                var payment = new Payment
                {
                    TicketId = ticket.Id,
                    TotalPrice = totalAmount,
                    paymentMethod = dto.PaymentMethod,
                    Date = showtime.Date,
                    Status = "Đã Thanh toán" // Staff tạo = đã thanh toán
                };

                _context.Payment.Add(payment);

                // 9. Cập nhật StatusSeat
                var statusSeats = seats.Select(seat => new StatusSeat
                {
                    SeatId = seat.Id,
                    ShowtimeId = dto.ShowtimeId,
                    Status = "Booked" // Đã book
                }).ToList();

                _context.StatusSeat.AddRange(statusSeats);
                await _context.SaveChangesAsync();

                // 10. Tính tiền thối (chỉ cho Cash)
                decimal change = (dto.PaymentMethod == "Cash" && dto.PaidAmount.HasValue) 
                    ? dto.PaidAmount.Value - totalAmount : 0;

                // 11. Return response
                return new BookingResponseDto
                {
                    TicketId = ticket.Id,
                    BookingCode = ticket.Id.ToString("D8"),
                    ShowtimeId = dto.ShowtimeId,
                    MovieTitle = showtime.Movies!.Title!,
                    RoomName = showtime.Rooms!.Name!,
                    ShowtimeStart = new DateTime(
                        showtime.Date.Year,
                        showtime.Date.Month,
                        showtime.Date.Day,
                        showtime.Start.Hour,
                        showtime.Start.Minute,
                        showtime.Start.Second
                    ),
                    SeatNumbers = seats.Select(s => s.Name!).ToList(),
                    TotalAmount = totalAmount,
                    PaymentMethod = dto.PaymentMethod,
                    PaymentStatus = "Paid",
                    PaidAmount = dto.PaidAmount,
                    ChangeAmount = change
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateStaffBookingAsync: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task<List<int>> GetAvailableSeatsAsync(int showtimeId)
        {
            var showtime = await _context.Showtimes
                .FirstOrDefaultAsync(s => s.Id == showtimeId);

            if (showtime == null)
                throw new ArgumentException("Suất chiếu không tồn tại");

            // 1. Lấy tất cả ghế của phòng
            var allSeatIds = await _context.Seats
                .Where(s => s.RoomId == showtime.RoomId)
                .Select(s => s.Id)
                .ToListAsync();

            // 2. Lấy ghế đã book trong DB
            var bookedSeatIds = await _context.StatusSeat
                .Where(ss => ss.ShowtimeId == showtimeId
                          && (ss.Status == "Booked" || ss.Status == "Pending"))
                .Select(ss => ss.SeatId)
                .ToListAsync();

            // 3. Lấy ghế đang hold trong Redis
            var db = _redis.GetDatabase();
            var heldSeatIds = new List<int>();
            
            foreach (var seatId in allSeatIds)
            {
                var seatKey = $"CineBook:seat:{showtimeId}:{seatId}";
                var isHeld = await db.KeyExistsAsync(seatKey);
                if (isHeld)
                {
                    heldSeatIds.Add(seatId);
                }
            }

            // 4. Loại bỏ ghế đã book VÀ ghế đang hold
            var unavailableSeatIds = bookedSeatIds.Concat(heldSeatIds).Distinct().ToList();
            return allSeatIds.Where(id => !unavailableSeatIds.Contains(id)).ToList();
        }

        public async Task<decimal> CalculateTotalAmountAsync(List<int> seatIds, int showtimeId)
        {
            var seats = await _context.Seats
                .Where(s => seatIds.Contains(s.Id))
                .ToListAsync();

            return seats.Sum(s => s.Price);
        }
    }
}
