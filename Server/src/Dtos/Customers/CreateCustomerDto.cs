using System;

namespace Server.src.Dtos.Customers
{
    public class CreateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public DateOnly Birth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int? UserId { get; set; } // Optional - cho registered user
        public string? username { get; set; }
        public string? Email { get; set; }
        public string? password { get; set; }
        public string? phoneNumber { get; set; }
        public DateTime createdDate { get; set; }
    }
}
