using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.src.Dtos.Customers
{
    public class UpdateCustomerDto
    {
        public string? Name { get; set; }
        public DateOnly Birth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Avatar { get; set; }
    }
}