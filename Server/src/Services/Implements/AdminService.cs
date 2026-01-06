using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Admin;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class AdminService : IAdminService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMinioStorageService _minio;

        public AdminService(ApplicationDbContext context, IMinioStorageService minio)
        {
            _context = context;
            _minio = minio;
        }

        public async Task<Admin?> GetInfoAdminById(int id)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(c => c.Id == id);
            
            // Chuyển path thành URL
            if (admin != null && !string.IsNullOrEmpty(admin.Avatar))
            {
                admin.Avatar = _minio.GetImageUrl(admin.Avatar);
            }
            
            return admin;
        }

        public async Task<Admin> UpdateInfoAdmin(UpdateAdminDto updateAdminDto, int id)
        {
            var admin = await _context.Admins.FindAsync(id);

            admin.Address = updateAdminDto.Address;
            admin.Avatar = updateAdminDto.Avatar;
            admin.Birth = updateAdminDto.Birth;
            admin.Email = updateAdminDto.Email;
            admin.Gender = updateAdminDto.Gender;
            admin.Name = updateAdminDto.Name;
            admin.Phone = updateAdminDto.Phone;

            await _context.SaveChangesAsync();

            // Chuyển path thành URL khi trả về
            if (!string.IsNullOrEmpty(admin.Avatar))
            {
                admin.Avatar = _minio.GetImageUrl(admin.Avatar);
            }

            return admin;
        }

        public async Task<List<Admin>> GetAllInfoAdmin()
        {
            var admins = await _context.Admins.ToListAsync();
            
            return admins;
        }

        public async Task<List<Staff>> GetAllStaff()
        {
            var staff = await _context.Staff.ToListAsync();
            
            return staff;
        }

        public async Task<List<Customer>> GetAllCustomer()
        {
            var customer = await _context.Customers.ToListAsync();
            
            return customer;
        }

        public async Task<User> CreateAdmin(CreateAdminDto createAdminDto)
        {
            // Kiểm tra username đã tồn tại
            var existingUser = await _context.User
                .FirstOrDefaultAsync(u => u.username == createAdminDto.username);
            if (existingUser != null)
                throw new Result("Tên đăng nhập đã tồn tại");

            // Kiểm tra email đã tồn tại trong Admin
            var existingAdmin = await _context.Admins
                .FirstOrDefaultAsync(c => c.Email == createAdminDto.Email);
            if (existingAdmin != null)
                throw new Result("Email đã được sử dụng");

            // Hash password
            var hashedPassword = PasswordHelper.HashPassword(createAdminDto.password);

            // Tạo User mới
            var newAdmin = await createAdminDto.ToUserFromCreateAdminDto();
            newAdmin.Avatar = createAdminDto.Avatar;
            newAdmin.password = hashedPassword;

            // Thêm User vào database
            await _context.User.AddAsync(newAdmin);
            await _context.SaveChangesAsync();

            // Tìm role "Customer" trong database
            var adminRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Admin");

            if (adminRole != null)
            {
                // Tạo UserRole để gán role Customer cho user mới
                var userRole = new UserRole
                {
                    UserId = newAdmin.Id,
                    RoleId = adminRole.Id,
                    AssignedDate = DateTime.UtcNow
                };

                await _context.UserRoles.AddAsync(userRole);
            }

            // Tạo Customer mới liên kết với User
            var newAdmins = new Admin
            {
                Name = createAdminDto.Name,
                Email = createAdminDto.Email,
                Phone = createAdminDto.phoneNumber,
                Birth = createAdminDto.Birth,
                Gender = createAdminDto.Gender,
                Address = createAdminDto.Address,
                UserId = newAdmin.Id
            };

            await _context.Admins.AddAsync(newAdmins);
            await _context.SaveChangesAsync();

            return newAdmin;
        }

        public async Task<Admin> UpdateAdmin(UpdateAdminsDto updateAdminsDto, int id)
        {
            var admin = await _context.Admins.FindAsync(id);

            admin.Address = updateAdminsDto.Address;
            admin.Avatar = updateAdminsDto.Avatar;
            admin.Birth = updateAdminsDto.Birth;
            admin.Email = updateAdminsDto.Email;
            admin.Gender = updateAdminsDto.Gender;
            admin.Name = updateAdminsDto.Name;
            admin.Phone = updateAdminsDto.Phone;

            await _context.SaveChangesAsync();

            // Chuyển path thành URL khi trả về
            if (!string.IsNullOrEmpty(admin.Avatar))
            {
                admin.Avatar = _minio.GetImageUrl(admin.Avatar);
            }

            return admin;
        }

        public async Task<User> CreateStaff(CreateStaffDto createStaffDto)
        {
            // Kiểm tra username đã tồn tại
            var existingUser = await _context.User
                .FirstOrDefaultAsync(u => u.username == createStaffDto.username);
            if (existingUser != null)
                throw new Result("Tên đăng nhập đã tồn tại");

            // Kiểm tra email đã tồn tại trong Staff
            var existingStaff = await _context.Staff
                .FirstOrDefaultAsync(c => c.Email == createStaffDto.Email);
            if (existingStaff != null)
                throw new Result("Email đã được sử dụng");

            // Hash password
            var hashedPassword = PasswordHelper.HashPassword(createStaffDto.password);

            // Tạo User mới
            var newStaff = await createStaffDto.ToUserFromCreateStaffDto();
            newStaff.Avatar = createStaffDto.Avatar;
            newStaff.password = hashedPassword;

            // Thêm User vào database
            await _context.User.AddAsync(newStaff);
            await _context.SaveChangesAsync();

            // Tìm role "Staff" trong database
            var staffRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Staff");

            if (staffRole != null)
            {
                // Tạo UserRole để gán role Staff cho user mới
                var userRole = new UserRole
                {
                    UserId = newStaff.Id,
                    RoleId = staffRole.Id,
                    AssignedDate = DateTime.UtcNow
                };

                await _context.UserRoles.AddAsync(userRole);
            }

            // Tạo Staff mới liên kết với User
            var newStaffs = new Staff
            {
                Name = createStaffDto.Name,
                Email = createStaffDto.Email,
                Phone = createStaffDto.phoneNumber,
                Birth = createStaffDto.Birth,
                Gender = createStaffDto.Gender,
                Address = createStaffDto.Address,
                UserId = newStaff.Id
            };

            await _context.Staff.AddAsync(newStaffs);
            await _context.SaveChangesAsync();

            return newStaff;
        }

        public async Task<Staff> UpdateStaff(UpdateStaffDto updateStaffDto, int id)
        {
            var staff = await _context.Staff.FindAsync(id);

            staff.Address = updateStaffDto.Address;
            staff.Avatar = updateStaffDto.Avatar;
            staff.Birth = updateStaffDto.Birth;
            staff.Email = updateStaffDto.Email;
            staff.Gender = updateStaffDto.Gender;
            staff.Name = updateStaffDto.Name;
            staff.Phone = updateStaffDto.Phone;

            await _context.SaveChangesAsync();

            // Chuyển path thành URL khi trả về
            if (!string.IsNullOrEmpty(staff.Avatar))
            {
                staff.Avatar = _minio.GetImageUrl(staff.Avatar);
            }

            return staff;
        }

        public async Task<Admin> DeleteAdmin(int id)
        {
            var admin = await _context.Admins.FindAsync(id);
            if (admin == null)
                throw new Result("Không tìm thấy Admin cần xóa");

            // Tìm User liên kết
            if (admin.UserId.HasValue)
            {
                var user = await _context.User.FindAsync(admin.UserId.Value);
                if (user != null)
                {
                    // Xóa UserRole
                    var userRole = await _context.UserRoles
                        .FirstOrDefaultAsync(ur => ur.UserId == user.Id);
                    if (userRole != null)
                    {
                        _context.UserRoles.Remove(userRole);
                    }

                    // Xóa User
                    _context.User.Remove(user);
                }
            }

            // Xóa Admin
            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return admin;
        }

        public async Task<Staff> DeleteStaff(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
                throw new Result("Không tìm thấy Staff cần xóa");

            // Tìm User liên kết
            if (staff.UserId.HasValue)
            {
                var user = await _context.User.FindAsync(staff.UserId.Value);
                if (user != null)
                {
                    // Xóa UserRole
                    var userRole = await _context.UserRoles
                        .FirstOrDefaultAsync(ur => ur.UserId == user.Id);
                    if (userRole != null)
                    {
                        _context.UserRoles.Remove(userRole);
                    }

                    // Xóa User
                    _context.User.Remove(user);
                }
            }

            // Xóa Staff
            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return staff;
        }

        public async Task<Customer> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                throw new Result("Không tìm thấy Customer cần xóa");

            // Tìm User liên kết
            if (customer.UserId.HasValue)
            {
                var user = await _context.User.FindAsync(customer.UserId.Value);
                if (user != null)
                {
                    // Xóa UserRole
                    var userRole = await _context.UserRoles
                        .FirstOrDefaultAsync(ur => ur.UserId == user.Id);
                    if (userRole != null)
                    {
                        _context.UserRoles.Remove(userRole);
                    }

                    // Xóa User
                    _context.User.Remove(user);
                }
            }

            // Xóa Customer
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return customer;
        }
    }
}