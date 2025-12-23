using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Server.src.Data;
using Server.src.Services.Implements;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ApiControllerBase
    {
        private readonly VNPayService _vnPayService;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly QRCodeService _qrCodeService;
        private readonly EmailService _emailService;

        public PaymentController(
            VNPayService vnPayService,
            ApplicationDbContext context,
            IConfiguration configuration,
            QRCodeService qrCodeService,
            EmailService emailService,
            ILogger<PaymentController> logger) : base(logger)
        {
            _vnPayService = vnPayService;
            _context = context;
            _configuration = configuration;
            _qrCodeService = qrCodeService;
            _emailService = emailService;
        }

        /// <summary>
        /// Tạo URL thanh toán VNPay
        /// </summary>
        [AllowAnonymous]
        [HttpPost("vnpay/create")]
        public IActionResult CreateVNPayPayment([FromBody] VNPayRequestDto request)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                var paymentUrl = _vnPayService.CreatePaymentUrl(
                    request.TicketId,
                    request.Amount,
                    request.OrderInfo,
                    ipAddress
                );

                return Ok(new
                {
                    isSuccess = true,
                    paymentUrl = paymentUrl,
                    message = "Tạo link thanh toán thành công"
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// VNPay IPN/Return callback
        /// </summary>
        [AllowAnonymous]
        [HttpGet("vnpay/callback")]
        public async Task<IActionResult> VNPayCallback()
        {
            try
            {
                var vnpayData = Request.Query.ToDictionary(x => x.Key, x => x.Value.ToString());
                var secureHash = vnpayData.ContainsKey("vnp_SecureHash") ? vnpayData["vnp_SecureHash"] : "";

                // Validate signature
                if (!_vnPayService.ValidateSignature(vnpayData, secureHash))
                {
                    return BadRequest(new { message = "Chữ ký không hợp lệ" });
                }

                var vnp_ResponseCode = vnpayData["vnp_ResponseCode"];
                var vnp_TxnRef = vnpayData["vnp_TxnRef"];
                var vnp_Amount = int.Parse(vnpayData["vnp_Amount"]) / 100;

                // Extract ticketId from TxnRef
                var ticketId = int.Parse(vnp_TxnRef.Split('_')[0]);

                // Update payment status
                var payment = await _context.Payment
                    .FirstOrDefaultAsync(p => p.TicketId == ticketId);

                if (payment == null)
                {
                    return NotFound(new { message = "Không tìm thấy thanh toán" });
                }

                if (vnp_ResponseCode == "00")
                {
                    // Payment success
                    payment.Status = "Đã thanh toán";
                    payment.Date = DateOnly.FromDateTime(DateTime.Now);

                    // Update StatusSeat from Pending to Booked
                    var ticket = await _context.Tickets
                        .Include(t => t.Showtimes)
                            .ThenInclude(s => s.Movies)
                        .Include(t => t.Showtimes)
                            .ThenInclude(s => s.Rooms)
                        .Include(t => t.Customer)
                        .FirstOrDefaultAsync(t => t.Id == ticketId);

                    if (ticket != null)
                    {
                        var statusSeats = await _context.StatusSeat
                            .Where(ss => ss.ShowtimeId == ticket.ShowtimeId && ss.Status == "Pending")
                            .ToListAsync();

                        foreach (var ss in statusSeats)
                        {
                            ss.Status = "Booked";
                        }

                        // Get seat info
                        var seatIds = statusSeats.Select(ss => ss.SeatId).ToList();
                        var seats = await _context.Seats
                            .Where(s => seatIds.Contains(s.Id))
                            .ToListAsync();
                        var seatNumbers = seats.Select(s => s.Name ?? "").ToArray();

                        // Generate QR Code
                        try
                        {
                            var qrUrl = await _qrCodeService.GenerateQRCodeAsync(
                                ticket.Id, 
                                ticket.Customer?.Name ?? "Customer"
                            );
                            Console.WriteLine($"✅ QR Code generated: {qrUrl}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"❌ QR Code generation failed: {ex.Message}");
                        }

                        // Send confirmation email
                        if (!string.IsNullOrEmpty(ticket.Customer?.Email))
                        {
                            try
                            {
                                await _emailService.SendTicketConfirmationAsync(
                                    ticket.Customer.Email,
                                    ticket.Id,
                                    ticket.Customer.Name ?? "Customer",
                                    ticket.Showtimes?.Movies?.Title ?? "Movie",
                                    ticket.Showtimes?.Rooms?.Name ?? "Room",
                                    new DateTime(
                                        ticket.Date.Year,
                                        ticket.Date.Month,
                                        ticket.Date.Day,
                                        ticket.Showtimes?.Start.Hour ?? 0,
                                        ticket.Showtimes?.Start.Minute ?? 0,
                                        0
                                    ),
                                    seatNumbers,
                                    ticket.TotalPrice
                                );
                                Console.WriteLine($"✅ Email sent to {ticket.Customer.Email}");
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"❌ Email sending failed: {ex.Message}");
                            }
                        }
                    }

                    await _context.SaveChangesAsync();

                    var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:3001";
                    return Redirect($"{frontendUrl}/booking-success/{ticketId}");
                }
                else
                {
                    // Payment failed
                    payment.Status = "Thất bại";

                    // Release seats
                    var ticket = await _context.Tickets
                        .FirstOrDefaultAsync(t => t.Id == ticketId);

                    if (ticket != null)
                    {
                        var statusSeats = await _context.StatusSeat
                            .Where(ss => ss.ShowtimeId == ticket.ShowtimeId && ss.Status == "Pending")
                            .ToListAsync();

                        _context.StatusSeat.RemoveRange(statusSeats);
                    }

                    await _context.SaveChangesAsync();

                    var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:3001";
                    return Redirect($"{frontendUrl}/booking-failed");
                }
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    public class VNPayRequestDto
    {
        public int TicketId { get; set; }
        public int Amount { get; set; }
        public string OrderInfo { get; set; } = string.Empty;
    }
}
