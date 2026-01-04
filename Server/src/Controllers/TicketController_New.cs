using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Services.Implements;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketControllerNew : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly QRCodeService _qrCodeService;

        public TicketControllerNew(
            ApplicationDbContext context,
            QRCodeService qrCodeService,
            ILogger<TicketControllerNew> logger) : base(logger)
        {
            _context = context;
            _qrCodeService = qrCodeService;
        }

        /// <summary>
        /// Get ticket details with QR code
        /// </summary>
        [AllowAnonymous]
        [HttpGet("{ticketId}")]
        public async Task<IActionResult> GetTicketDetails(int ticketId)
        {
            try
            {
                var ticket = await _context.Tickets
                    .Include(t => t.Showtimes)
                        .ThenInclude(s => s.Movies)
                    .Include(t => t.Showtimes)
                        .ThenInclude(s => s.Rooms)
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == ticketId);

                if (ticket == null)
                {
                    return NotFound(new { message = "Không tìm thấy vé" });
                }

                // Get seat info
                var statusSeats = await _context.StatusSeat
                    .Where(ss => ss.ShowtimeId == ticket.ShowtimeId)
                    .Select(ss => ss.SeatId)
                    .ToListAsync();

                var seats = await _context.Seats
                    .Where(s => statusSeats.Contains(s.Id))
                    .Select(s => s.Name)
                    .ToListAsync();

                // Generate QR if not exists (fallback)
                var qrBase64 = _qrCodeService.GenerateQRCodeBase64(
                    ticket.Id,
                    ticket.User?.Name ?? "Customer"
                );

                return Ok(new
                {
                    ticketId = ticket.Id,
                    bookingCode = ticket.Id.ToString("D8"),
                    movieTitle = ticket.Showtimes?.Movies?.Title,
                    roomName = ticket.Showtimes?.Rooms?.Name,
                    showtime = new DateTime(
                        ticket.Date.Year,
                        ticket.Date.Month,
                        ticket.Date.Day,
                        ticket.Showtimes?.Start.Hour ?? 0,
                        ticket.Showtimes?.Start.Minute ?? 0,
                        0
                    ),
                    seats = seats,
                    totalPrice = ticket.TotalPrice,
                    customerName = ticket.User?.Name,
                    customerEmail = ticket.User?.Email,
                    qrCodeBase64 = qrBase64
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
