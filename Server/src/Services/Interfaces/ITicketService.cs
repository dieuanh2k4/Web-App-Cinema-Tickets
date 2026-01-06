using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Server.src.Dtos.Tickets;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ITicketService
    {
        Task<TicketDto> BookTicket(CreateTicketDto createTicketDto);
        Task<List<TicketDto>> GetAllTickets();
        Task<TicketDto> GetTicketById(int id);
        Task<List<TicketDto>> GetTicketHistory(int userId);
        Task<List<TicketDto>> GetTicketsByCustomerEmail(string email);
        Task<bool> CancelTicket(int ticketId);
    }
}
