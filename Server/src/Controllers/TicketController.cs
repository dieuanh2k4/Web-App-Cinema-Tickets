using System;
using System.Collections.Generic;
using System.Linq;
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
        [Authorize(Roles = "Staff, Admin")]
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
        [Authorize(Roles = "Staff, Admin")]
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
        [Authorize(Roles = "Staff, Admin")]
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
        [Authorize(Roles = "Staff, Admin")]
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
        /// Hủy vé
        /// </summary>
        [HttpDelete("cancel/{id}")]
        [Authorize(Roles = "Staff, Admin")]
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
