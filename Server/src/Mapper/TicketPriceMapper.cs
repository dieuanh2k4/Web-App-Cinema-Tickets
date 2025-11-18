using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.TicketPrices;
using Server.src.Models;

namespace Server.src.Mapper
{
    public static class TicketPriceMapper
    {
        public static async Task<CreateTicketPriceDto> ToTicketPriceDto(this TicketPrice ticketPrice)
        {
            return new CreateTicketPriceDto
            {
                Price = ticketPrice.Price,
                RoomType = ticketPrice.RoomType,
                SeatType = ticketPrice.SeatType
            };
        }

        public static async Task<TicketPrice> ToTicketPriceFromDto(this CreateTicketPriceDto createTicketPriceDto)
        {
            return new TicketPrice
            {
                Price = createTicketPriceDto.Price,
                RoomType = createTicketPriceDto.RoomType,
                SeatType = createTicketPriceDto.SeatType
            };
        }
    }
}