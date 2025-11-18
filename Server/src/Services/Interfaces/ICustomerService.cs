using System.Threading.Tasks;
using Server.src.Dtos.Customers;
using Server.src.Models;

namespace Server.src.Services.Interfaces
{
    public interface ICustomerService
    {
        /// <summary>
        /// Tìm customer theo phone, nếu không có thì tạo mới (Guest)
        /// </summary>
        Task<Customer> FindOrCreateByPhoneAsync(string phone, string name, string? email = null);
        
        /// <summary>
        /// Tạo customer mới
        /// </summary>
        Task<Customer> CreateCustomerAsync(CreateCustomerDto dto);
        
        /// <summary>
        /// Lấy customer theo ID
        /// </summary>
        Task<Customer?> GetByIdAsync(int id);
    }
}
