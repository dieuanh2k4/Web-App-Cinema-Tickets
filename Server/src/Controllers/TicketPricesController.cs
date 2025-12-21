using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.TicketPrices;
using Server.src.Mapper;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketPricesController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITicketPriceService _ticketpriceService;

        public TicketPricesController(ApplicationDbContext context, ITicketPriceService ticketPriceService, ILogger<RoomController> logger) : base(logger)
        {
            _context = context;
            _ticketpriceService = ticketPriceService;
        }

        [AllowAnonymous]
        [HttpGet("get-all-ticket-price")]
        public async Task<IActionResult> GetTicketPrice()
        {
            try
            {
                var ticketprice = await _ticketpriceService.GetAllTicketPrices();
                var ticketpricedto = ticketprice.Select(t => t.ToTicketPriceDto());

                return Ok(ticketprice);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-ticket-price")]
        public async Task<IActionResult> CreateTicketPrice([FromBody] CreateTicketPriceDto createTicketPriceDto)
        {
            try
            {
                var createTicketPrice = await _ticketpriceService.AddTicketPrice(createTicketPriceDto);

                await _context.TicketPrices.AddAsync(createTicketPrice);
                await _context.SaveChangesAsync();

                return Ok(createTicketPrice);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update-ticket-price/{id}")]
        public async Task<IActionResult> UpdateTicketPrice([FromBody] UpdateTicketPriceDto updateTicketPriceDto, int id)
        {
            try
            {
                var ticketprice = await _ticketpriceService.UpdateTicketPrice(updateTicketPriceDto, id);

                await _context.SaveChangesAsync();

                return Ok(ticketprice);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-ticket-price/{id}")]
        public async Task<IActionResult> DeleteTicketPrice(int id)
        {
            try
            {
                var ticketprice = await _ticketpriceService.DeleteTicketPrice(id);

                _context.TicketPrices.Remove(ticketprice);
                await _context.SaveChangesAsync();

                return Ok(ticketprice);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }
}