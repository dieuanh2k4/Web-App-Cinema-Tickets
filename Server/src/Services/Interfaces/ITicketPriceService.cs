using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.TicketPrices;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ITicketPriceService
    {
        Task<List<TicketPrice>> GetAllTicketPrices();
        Task<TicketPrice> AddTicketPrice(CreateTicketPriceDto createTicketPriceDto);
        Task<TicketPrice> UpdateTicketPrice([FromBody] UpdateTicketPriceDto updateTicketPriceDto, int id);
        Task<TicketPrice> DeleteTicketPrice(int id);
    }
}