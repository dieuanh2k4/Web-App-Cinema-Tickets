using System.Threading.Tasks;
using Server.src.Dtos.Customers;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ICustomerService
    {
        /// Tìm customer theo phone, nếu không có thì tạo mới (Guest)
        Task<Customer> FindOrCreateByPhoneAsync(string phone, string name, string? email = null);
        
        /// Tạo customer mới
        Task<Customer> CreateCustomerAsync(CreateCustomerDto dto);
        
        /// Lấy customer theo ID
        Task<Customer?> GetByIdAsync(int id);

        Task<Customer> UpdateInfoCustomer(UpdateCustomerDto updateCustomerDto, int id);
    }
}
