using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public int TotalPrice { get; set; }
        public DateOnly Date { get; set; }
        public string? Status { get; set; }
        public string? paymentMethod { get; set; }

        public Ticket? Ticket { get; set; }
    }
}