using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Models;
using Server.src.Repositories.Interfaces;

namespace Server.src.Repositories.Implements
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;

        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Customer?> GetByPhoneAsync(string phone)
        {
            return await _context.Customer
                .FirstOrDefaultAsync(c => c.Phone == phone);
        }

        public async Task<Customer> CreateAsync(Customer customer)
        {
            await _context.Customer.AddAsync(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _context.Customer
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}
