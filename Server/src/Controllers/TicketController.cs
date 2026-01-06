using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.Tickets;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ApiControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService, ILogger<TicketController> logger) : base(logger)
        {
            _ticketService = ticketService;
        }

        /// <summary>
        /// Đặt vé xem phim
        /// </summary>
        [HttpPost("book")]
        public async Task<IActionResult> BookTicket([FromBody] CreateTicketDto createTicketDto)
        {
            try
            {
                var ticket = await _ticketService.BookTicket(createTicketDto);
                return Ok(new
                {
                    success = true,
                    message = "Đặt vé thành công",
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy tất cả vé
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTickets()
        {
            try
            {
                var tickets = await _ticketService.GetAllTickets();
                return Ok(new
                {
                    success = true,
                    data = tickets,
                    count = tickets.Count
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy thông tin vé theo ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTicketById(int id)
        {
            try
            {
                var ticket = await _ticketService.GetTicketById(id);
                return Ok(new
                {
                    success = true,
                    data = ticket
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Lấy danh sách vé theo email khách hàng
        /// </summary>
        [HttpGet("customer/{email}")]
        public async Task<IActionResult> GetTicketsByCustomerEmail(string email)
        {
            try
            {
                var tickets = await _ticketService.GetTicketsByCustomerEmail(email);
                return Ok(new
                {
                    success = true,
                    data = tickets,
                    count = tickets.Count
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

                /// <summary>
        /// Lấy lịch sử đặt vé của người dùng hiện tại
        /// </summary>
        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetTicketHistory()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Không tìm thấy thông tin người dùng"
                    });
                }

                var tickets = await _ticketService.GetTicketHistory(userId);
                return Ok(new
                {
                    success = true,
                    data = tickets,
                    count = tickets.Count
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        /// <summary>
        /// Hủy vé
        /// </summary>
        [HttpDelete("cancel/{id}")]
        public async Task<IActionResult> CancelTicket(int id)
        {
            try
            {
                var result = await _ticketService.CancelTicket(id);
                return Ok(new
                {
                    success = true,
                    message = "Hủy vé thành công"
                });
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}
