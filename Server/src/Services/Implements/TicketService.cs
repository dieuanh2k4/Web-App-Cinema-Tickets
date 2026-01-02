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
            var bookedSeats = await _context.Tickets
                .Where(t => t.ShowtimeId == createTicketDto.ShowtimeId && 
                           createTicketDto.SeatIds.Contains(t.SeatId))
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
                customer = createTicketDto.Customer!.ToCustomer();
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
            }

            // 4. Calculate total price
            int totalPrice = seats.Sum(s => s.Price);

            // 5. Create tickets for each seat
            var tickets = new List<Ticket>();
            foreach (var seat in seats)
            {
                var ticket = new Ticket
                {
                    ShowtimeId = showtime.Id,
                    UserId = customer.Id,
                    SeatId = seat.Id,
                    RoomId = showtime.RoomId,
                    MovieId = showtime.MovieId,
                    SumOfSeat = createTicketDto.SeatIds.Count,
                    Date = showtime.Date,
                    TotalPrice = totalPrice
                };
                tickets.Add(ticket);
            }

            // 6. Save tickets
            _context.Tickets.AddRange(tickets);
            await _context.SaveChangesAsync();

            // 7. Update seat status to "Đã đặt"
            foreach (var seat in seats)
            {
                seat.Status = "Đã đặt";
            }
            await _context.SaveChangesAsync();

            // 8. Return the first ticket with all information (they all have same info except SeatId)
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Id == customer.Id);
                
            var mainTicket = tickets.First();
            mainTicket.User = user;
            mainTicket.Showtimes = showtime;
            mainTicket.Movies = showtime.Movies;
            mainTicket.Rooms = showtime.Rooms;

            return mainTicket.ToTicketDto(seats);
        }

        public async Task<List<TicketDto>> GetAllTickets()
        {
            var tickets = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                .Include(t => t.Seats)
                .GroupBy(t => new { t.ShowtimeId, t.UserId, t.Date })
                .ToListAsync();

            var ticketDtos = new List<TicketDto>();
            foreach (var group in tickets)
            {
                var firstTicket = group.First();
                var seats = group.Select(t => t.Seats!).ToList();
                ticketDtos.Add(firstTicket.ToTicketDto(seats));
            }

            return ticketDtos;
        }

        public async Task<TicketDto> GetTicketById(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.User)
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                .Include(t => t.Seats)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (ticket == null)
            {
                throw new Result("Vé không tồn tại");
            }

            // Get all tickets with same booking (same showtime, customer, date)
            var relatedTickets = await _context.Tickets
                .Include(t => t.Seats)
                .Where(t => t.ShowtimeId == ticket.ShowtimeId && 
                           t.UserId == ticket.UserId && 
                           t.Date == ticket.Date)
                .ToListAsync();

            var seats = relatedTickets.Select(t => t.Seats!).ToList();
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
                .Include(t => t.Showtimes)
                .Include(t => t.Movies)
                .Include(t => t.Rooms)
                .Include(t => t.Seats)
                .Where(t => t.UserId == customer.Id)
                .GroupBy(t => new { t.ShowtimeId, t.Date })
                .ToListAsync();

            var ticketDtos = new List<TicketDto>();
            foreach (var group in tickets)
            {
                var firstTicket = group.First();
                var seats = group.Select(t => t.Seats!).ToList();
                ticketDtos.Add(firstTicket.ToTicketDto(seats));
            }

            return ticketDtos;
        }

        public async Task<bool> CancelTicket(int ticketId)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Seats)
                .FirstOrDefaultAsync(t => t.Id == ticketId);

            if (ticket == null)
            {
                throw new Result("Vé không tồn tại");
            }

            // Get all tickets with same booking
            var relatedTickets = await _context.Tickets
                .Include(t => t.Seats)
                .Where(t => t.ShowtimeId == ticket.ShowtimeId && 
                           t.UserId == ticket.UserId && 
                           t.Date == ticket.Date)
                .ToListAsync();

            // Update seat status back to available
            foreach (var relatedTicket in relatedTickets)
            {
                if (relatedTicket.Seats != null)
                {
                    relatedTicket.Seats.Status = "Trống";
                }
            }

            // Remove all related tickets
            _context.Tickets.RemoveRange(relatedTickets);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
