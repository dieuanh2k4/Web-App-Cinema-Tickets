using System;

namespace Server.src.Dtos.Customers
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateOnly Birth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string Phone { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int? UserId { get; set; } // null = Guest, có giá trị = Registered User
    }
}
