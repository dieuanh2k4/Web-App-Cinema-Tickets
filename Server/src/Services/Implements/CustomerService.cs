using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Customers;
using Server.src.Exceptions;
using Server.src.Models;
using Server.src.Repositories.Interfaces;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private readonly ApplicationDbContext _context;
        private readonly IMinioStorageService _minioStorage;

        public CustomerService(ICustomerRepository customerRepository, ApplicationDbContext context, IMinioStorageService minioStorage)
        {
            _customerRepository = customerRepository;
            _context = context;
            _minioStorage = minioStorage;
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

        // public async Task<User> CreateCustomerAsync(CreateCustomerDto createCustomerDto)
        // {
        //     // Kiểm tra username đã tồn tại
        //     var existingUser = await _context.User
        //         .FirstOrDefaultAsync(u => u.username == createCustomerDto.username);
        //     if (existingUser != null)
        //         throw new Result("Tên đăng nhập đã tồn tại");

        //     // Kiểm tra email đã tồn tại trong Admin
        //     var existingAdmin = await _context.Admins
        //         .FirstOrDefaultAsync(c => c.Email == createCustomerDto.Email);
        //     if (existingAdmin != null)
        //         throw new Result("Email đã được sử dụng");

        //     // Hash password
        //     var hashedPassword = PasswordHelper.HashPassword(createCustomerDto.password);

        //     // Tạo User mới
        //     var newAdmin = await createCustomerDto.ToUserFromRegisterDto();
        //     newAdmin.Avatar = createCustomerDto.Avatar;
        //     newAdmin.password = hashedPassword;

        //     // Thêm User vào database
        //     await _context.User.AddAsync(newAdmin);
        //     await _context.SaveChangesAsync();

        //     // Tìm role "Customer" trong database
        //     var adminRole = await _context.Roles
        //         .FirstOrDefaultAsync(r => r.Name == "Admin");

        //     if (adminRole != null)
        //     {
        //         // Tạo UserRole để gán role Customer cho user mới
        //         var userRole = new UserRole
        //         {
        //             UserId = newAdmin.Id,
        //             RoleId = adminRole.Id,
        //             AssignedDate = DateTime.UtcNow
        //         };

        //         await _context.UserRoles.AddAsync(userRole);
        //     }

        //     // Tạo Customer mới liên kết với User
        //     var newAdmins = new Admin
        //     {
        //         Name = createCustomerDto.Name,
        //         Phone = createCustomerDto.Phone,
        //         Email  = createCustomerDto.Email,
        //         Birth = createCustomerDto.Birth,
        //         Gender = createCustomerDto.Gender,
        //         Address = createCustomerDto.Address,
        //         UserId = newAdmin.Id
        //     };

        //     await _context.Admins.AddAsync(newAdmins);
        //     await _context.SaveChangesAsync();

        //     return newAdmin;
        // }

        public async Task<Customer?> GetByIdAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            
            // Chuyển path thành URL
            if (customer != null && !string.IsNullOrEmpty(customer.Avatar))
            {
                customer.Avatar = _minioStorage.GetImageUrl(customer.Avatar);
            }
            
            return customer;
        }

        public async Task<Customer> UpdateInfoCustomer(UpdateCustomerDto updateCustomerDto, int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            customer.Address = updateCustomerDto.Address;
            customer.Avatar = updateCustomerDto.Avatar;
            customer.Birth = updateCustomerDto.Birth;
            customer.Email = updateCustomerDto.Email;
            customer.gender = updateCustomerDto.Gender;
            customer.Name = updateCustomerDto.Name;
            customer.Phone = updateCustomerDto.Phone;

            await _context.SaveChangesAsync();

            // Chuyển path thành URL khi trả về
            if (!string.IsNullOrEmpty(customer.Avatar))
            {
                customer.Avatar = _minioStorage.GetImageUrl(customer.Avatar);
            }

            return customer;
        }
    }
}
