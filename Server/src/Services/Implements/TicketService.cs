using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Tickets;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class TicketService : ITicketService
    {
        private readonly ApplicationDbContext _context;

        public TicketService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<TicketDto> BookTicket(CreateTicketDto createTicketDto)
        {
            // 1. Validate showtime exists
            var showtime = await _context.Showtimes
                .Include(s => s.Movies)
                .Include(s => s.Rooms)
                .FirstOrDefaultAsync(s => s.Id == createTicketDto.ShowtimeId);

            if (showtime == null)
            {
                throw new Result("Suất chiếu không tồn tại");
            }

            // 2. Validate seats exist and are available
            var seats = await _context.Seats
                .Where(s => createTicketDto.SeatIds!.Contains(s.Id))
                .ToListAsync();

            if (seats.Count != createTicketDto.SeatIds!.Count)
            {
                throw new Result("Một hoặc nhiều ghế không tồn tại");
            }

            // Check if seats belong to the same room as showtime
            if (seats.Any(s => s.RoomId != showtime.RoomId))
            {
                throw new Result("Ghế không thuộc phòng chiếu này");
            }

            // Check if seats are already booked for this showtime
            var bookedSeats = await _context.TicketSeats
                .Where(ts => ts.Ticket!.ShowtimeId == createTicketDto.ShowtimeId && 
                           createTicketDto.SeatIds.Contains(ts.SeatId))
                .ToListAsync();

            if (bookedSeats.Any())
            {
                var bookedSeatNames = seats
                    .Where(s => bookedSeats.Select(b => b.SeatId).Contains(s.Id))
                    .Select(s => s.Name)
                    .ToList();
                throw new Result($"Ghế {string.Join(", ", bookedSeatNames)} đã được đặt");
            }

            // 3. Create or get customer
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == createTicketDto.Customer!.Email);

            if (customer == null)
            {
                customer = new Customer
                {
                    Email = createTicketDto.Customer!.Email,
                    Name = createTicketDto.Customer!.Name,
                    Phone = createTicketDto.Customer!.Phone
                };
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }

            // 4. Calculate total price
            int totalPrice = seats.Sum(s => s.Price);

            // 5. Create one ticket with multiple TicketSeats
            var ticket = new Ticket
            {
                ShowtimeId = showtime.Id,
                UserId = customer.Id,
                RoomId = showtime.RoomId,
                MovieId = showtime.MovieId,
                SumOfSeat = createTicketDto.SeatIds.Count,
                Date = showtime.Date,
                TotalPrice = totalPrice
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            // 5.1. Create TicketSeats for each seat
            var ticketSeats = seats.Select(seat => new TicketSeat
            {
                TicketId = ticket.Id,
                SeatId = seat.Id
            }).ToList();

            _context.TicketSeats.AddRange(ticketSeats);
            await _context.SaveChangesAsync();

            // 7. Update seat status to "Đã đặt"
            foreach (var seat in seats)
            {
                seat.Status = "Đã đặt";
            }
            await _context.SaveChangesAsync();

            // 8. Load relationships and return
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Id == customer.Id);
                
            ticket.User = user;
            ticket.Showtimes = showtime;
            ticket.Movies = showtime.Movies;
            ticket.Rooms = showtime.Rooms;

            return ticket.ToTicketDto(seats);
        }

        public async Task<List<TicketDto>> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Payment)
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                    .ThenInclude(r => r!.Theater)
                .Include(t => t.TicketSeats)
                    .ThenInclude(ts => ts.Seat)
                .ToListAsync();

            var ticketDtos = tickets.Select(ticket => 
            {
                var seats = ticket.TicketSeats?.Select(ts => ts.Seat!).ToList() ?? new List<Seats>();
                return ticket.ToTicketDto(seats);
            }).ToList();

            return ticketDtos;
        }

        public async Task<TicketDto> GetTicketById(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Payment)
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                    .ThenInclude(r => r!.Theater)
                .Include(t => t.TicketSeats)
                    .ThenInclude(ts => ts.Seat)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                throw new Result("Vé không tồn tại");
            }

            var seats = ticket.TicketSeats?.Select(ts => ts.Seat!).ToList() ?? new List<Seats>();
            return ticket.ToTicketDto(seats);
        }

        public async Task<List<TicketDto>> GetTicketsByCustomerEmail(string email)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == email);

            if (customer == null)
            {
                return new List<TicketDto>();
            }

            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Payment)
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                    .ThenInclude(r => r!.Theater)
                .Include(t => t.TicketSeats)
                    .ThenInclude(ts => ts.Seat)
                .Where(t => t.UserId == customer.Id)
                .ToListAsync();

            var ticketDtos = tickets.Select(ticket => 
            {
                var seats = ticket.TicketSeats?.Select(ts => ts.Seat!).ToList() ?? new List<Seats>();
                return ticket.ToTicketDto(seats);
            }).ToList();

            return ticketDtos;
        }

        public async Task<bool> CancelTicket(int ticketId)
        {
            var ticket = await _context.Tickets
                .Include(t => t.TicketSeats)
                    .ThenInclude(ts => ts.Seat)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                throw new Result("Vé không tồn tại");
            }

            // Update seat status back to available
            if (ticket.TicketSeats != null)
            {
                foreach (var ticketSeat in ticket.TicketSeats)
                {
                    if (ticketSeat.Seat != null)
                    {
                        ticketSeat.Seat.Status = "Trống";
                    }
                }
            }

            // Remove ticket (TicketSeats will be cascade deleted)
            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}