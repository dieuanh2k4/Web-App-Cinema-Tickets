using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<Customer?> GetByPhoneAsync(string phone);
        Task<Customer> CreateAsync(Customer customer);
        Task<Customer?> GetByIdAsync(int id);
    }
}
