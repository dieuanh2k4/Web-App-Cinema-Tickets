using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.TicketPrices;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class TicketPriceService : ITicketPriceService
    {
        private static readonly List<TicketPrice> _ticketprices = new List<TicketPrice>();
        private readonly ApplicationDbContext _context;

        public TicketPriceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<List<TicketPrice>> GetAllTicketPrices()
        {
            return _context.TicketPrices.ToListAsync();
        }

        public async Task<TicketPrice> AddTicketPrice(CreateTicketPriceDto createTicketPriceDto)
        {
            if (createTicketPriceDto.Price == null)
            {
                throw new Result("Giá không được trống");
            }

            if (createTicketPriceDto.RoomType == null)
            {
                throw new Result("Loại phòng không được trống");
            }
            var checkRoomType = _ticketprices.FirstOrDefault(m => m.RoomType.Equals(createTicketPriceDto.RoomType, StringComparison.OrdinalIgnoreCase));
            if (checkRoomType != null)
            {
                throw new Result($"Loại {createTicketPriceDto.RoomType} đã tồn tại");
            }

            if (createTicketPriceDto.SeatType == null)
            {
                throw new Result("Loại ghế không được trống");
            }
            var checkSeatType = _ticketprices.FirstOrDefault(m => m.SeatType.Equals(createTicketPriceDto.SeatType, StringComparison.OrdinalIgnoreCase));
            if (checkSeatType != null)
            {
                throw new Result($"Loại {createTicketPriceDto.SeatType} đã tồn tại");
            }

            var newTicketPrice = await createTicketPriceDto.ToTicketPriceFromDto();

            return newTicketPrice;
        }

        public async Task<TicketPrice> UpdateTicketPrice([FromBody] UpdateTicketPriceDto updateTicketPriceDto, int id)
        {
            var ticketprice = await _context.TicketPrices.FindAsync(id);

            if (ticketprice == null)
            {
                throw new Result("Không tìm thấy giá vé cần chỉnh sửa");
            }

            ticketprice.Price = updateTicketPriceDto.Price;
            ticketprice.RoomType = updateTicketPriceDto.RoomType;
            ticketprice.SeatType = updateTicketPriceDto.SeatType;

            return ticketprice;
        }

        public async Task<TicketPrice> DeleteTicketPrice(int id)
        {
            var ticketprice = await _context.TicketPrices.FindAsync(id);

            if (ticketprice == null)
            {
                throw new Result("Không tìm thấy giá phim cần xóa");
            }

            return ticketprice;
        }
    }
}