using System;
using System.Threading.Tasks;
using Server.src.Dtos.Customers;
using Server.src.Models;
using Server.src.Repositories.Interfaces;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<Customer> FindOrCreateByPhoneAsync(string phone, string name, string? email = null)
        {
            // Tìm customer theo số điện thoại
            var existingCustomer = await _customerRepository.GetByPhoneAsync(phone);
            
            if (existingCustomer != null)
            {
                return existingCustomer;
            }

            // Nếu chưa có -> tạo guest customer mới
            var newCustomer = new Customer
            {
                Name = name,
                Phone = phone,
                Birth = DateOnly.FromDateTime(DateTime.Now.AddYears(-18)), // Default 18 tuổi
                gender = "Khác",
                UserId = null // Guest customer
            };

            return await _customerRepository.CreateAsync(newCustomer);
        }

        public async Task<Customer> CreateCustomerAsync(CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                Name = dto.Name,
                Birth = dto.Birth,
                gender = dto.Gender,
                Address = dto.Address,
                Phone = dto.Phone,
                Avatar = dto.Avatar,
                UserId = dto.UserId
            };

            return await _customerRepository.CreateAsync(customer);
        }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            return await _customerRepository.GetByIdAsync(id);
        }
    }
}
