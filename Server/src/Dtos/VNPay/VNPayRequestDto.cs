using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.VNPay
{
    public class VNPayRequestDto
    {
        public int TicketId { get; set; }
        public int Amount { get; set; }
        public string OrderInfo { get; set; } = string.Empty;
    }
}