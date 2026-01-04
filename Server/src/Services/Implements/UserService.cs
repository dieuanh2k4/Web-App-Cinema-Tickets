using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Users;
using Server.src.Exceptions;
using Server.src.Mapper;
using Server.src.Models;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class UserService : IUserService
    {
        private static readonly List<User> _user = new List<User>();
        private readonly ApplicationDbContext _context;
        private readonly IMinioStorageService _minioStorage;
        private readonly ILogger<UserService> _logger;
        
        public UserService(ApplicationDbContext context, IMinioStorageService minioStorage, ILogger<UserService> logger)
        {
            _context = context;
            _minioStorage = minioStorage;
            _logger = logger;
        }

        public async Task<List<User>> GetAllUsers()
        {
            var users = await _context.User.ToListAsync();
            
            // // Chuyển path thành URL cho từng user
            // foreach (var user in users)
            // {
            //     if (!string.IsNullOrEmpty(user.Avatar))
            //     {
            //         user.Avatar = _minioStorage.GetImageUrl(user.Avatar);
            //     }
            // }
            
            return users;
        }

        // public async Task<User> CreateUser([FromForm] CreateUserDto createUserDto)
        // {
        //     // _logger.LogInformation($"CreateUser called with username: {createUserDto.username}, role: {createUserDto.RoleName}, gender: {createUserDto.Gender}");
            
        //     // Kiểm tra username đã tồn tại trong DB
        //     var checkUsername = await _context.User
        //         .FirstOrDefaultAsync(u => u.username.Equals(createUserDto.username, StringComparison.OrdinalIgnoreCase));

        //     if (checkUsername != null)
        //     {
        //         throw new Result($"Tên đăng nhập {createUserDto.username} đã tồn tại. Vui lòng thử tên đăng nhập khác");
        //     }

        //     // Kiểm tra email đã tồn tại trong DB
        //     var checkEmail = await _context.User
        //         .FirstOrDefaultAsync(u => u.Email.Equals(createUserDto.Email, StringComparison.OrdinalIgnoreCase));

        //     if (checkEmail != null)
        //     {
        //         throw new Result($"Email {createUserDto.Email} đã tồn tại. Vui lòng thử Email khác");
        //     }

        //     // Kiểm tra Gender hợp lệ
        //     var validGenders = new[] { "Nam", "Nữ", "Khác" };
        //     if (!validGenders.Contains(createUserDto.Gender))
        //     {
        //         throw new Result($"Gender '{createUserDto.Gender}' không hợp lệ. Chỉ chấp nhận: Nam, Nữ, Khác");
        //     }

        //     // Hash password
        //     var hashedPassword = PasswordHelper.HashPassword(createUserDto.password);

        //     // Kiểm tra RoleName có giá trị
        //     if (string.IsNullOrWhiteSpace(createUserDto.RoleName))
        //     {
        //         throw new Result("RoleName không được để trống. Chỉ hỗ trợ: Admin, Staff, Customer");
        //     }

        //     // Chuẩn hóa RoleName (viết hoa chữ cái đầu)
        //     var normalizedRoleName = char.ToUpper(createUserDto.RoleName[0]) + createUserDto.RoleName.Substring(1).ToLower();
        //     // _logger.LogInformation($"Normalized role name: {normalizedRoleName}");
            
        //     // Lấy role từ bảng Roles (đã có sẵn)
        //     var role = await _context.Roles
        //         .FirstOrDefaultAsync(r => r.Name.Equals(normalizedRoleName, StringComparison.OrdinalIgnoreCase));

        //     if (role == null)
        //     {
        //         throw new Result($"Role '{createUserDto.RoleName}' không tồn tại trong hệ thống. Chỉ hỗ trợ: Admin, Staff, Customer");
        //     }

        //     // Tạo User mới
        //     // _logger.LogInformation("Creating new user entity");
        //     var newUser = await createUserDto.ToUserFromCreateUserDto();

        //     _context.User.Add(newUser);
        //     await _context.SaveChangesAsync();
        //     _logger.LogInformation($"User created with ID: {newUser.Id}");

        //     // Lưu vào bảng UserRole
        //     var userRole = new UserRole
        //     {
        //         UserId = newUser.Id,
        //         RoleId = role.Id,
        //         AssignedDate = DateTime.UtcNow
        //     };
        //     _context.UserRoles.Add(userRole);

        //     // Lưu thông tin vào bảng tương ứng theo role
        //     switch (normalizedRoleName.ToLower())
        //     {
        //         case "admin":
        //             var admin = new Admin
        //             {
        //                 UserId = newUser.Id,
        //                 Name = createUserDto.Name,
        //                 Birth = createUserDto.Birth,
        //                 Gender = createUserDto.Gender,
        //                 Email = createUserDto.Email,
        //                 Phone = createUserDto.phoneNumber,
        //                 Address = createUserDto.Address,
        //                 Avatar = createUserDto.Avatar
        //             };
        //             _context.Admins.Add(admin);
        //             break;

        //         case "staff":
        //             var staff = new Staff
        //             {
        //                 UserId = newUser.Id,
        //                 Name = createUserDto.Name,
        //                 Birth = createUserDto.Birth,
        //                 Gender = createUserDto.Gender,
        //                 Email = createUserDto.Email,
        //                 Phone = createUserDto.phoneNumber,
        //                 Address = createUserDto.Address,
        //                 Avatar = createUserDto.Avatar
        //             };
        //             _context.Staff.Add(staff);
        //             break;

        //         case "customer":
        //             var customer = new Customer
        //             {
        //                 UserId = newUser.Id,
        //                 Name = createUserDto.Name,
        //                 Birth = createUserDto.Birth,
        //                 gender = createUserDto.Gender,
        //                 Email = createUserDto.Email,
        //                 Phone = createUserDto.phoneNumber,
        //                 Address = createUserDto.Address,
        //                 Avatar = createUserDto.Avatar
        //             };
        //             _context.Customers.Add(customer);
        //             break;

        //         default:
        //             throw new Result($"Role {createUserDto.RoleName} không được hỗ trợ");
        //     }

        //     await _context.SaveChangesAsync();

        //     return newUser;
        // }

        // public async Task<User> UpdateUser([FromForm] UpdateUserDto updateUserDto, int id)
        // {
        //     var user = await _context.User.FindAsync(id);

        //     if (user == null)
        //     {
        //         throw new Result("Không tìm thấy tài khoản cần chỉnh sửa");
        //     }

        //     // Update thông tin User
        //     user.Name = updateUserDto.Name;
        //     user.username = updateUserDto.username;
        //     user.Birth = updateUserDto.Birth;
        //     user.Gender = updateUserDto.Gender;
        //     user.Email = updateUserDto.Email;
        //     user.phoneNumber = updateUserDto.phoneNumber;
        //     user.Address = updateUserDto.Address;
        //     user.Avatar = updateUserDto.Avatar;
            
        //     // Chỉ hash password nếu password mới được cung cấp
        //     if (!string.IsNullOrEmpty(updateUserDto.password))
        //     {
        //         user.password = PasswordHelper.HashPassword(updateUserDto.password);
        //     }

        //     // Tìm role của user để update bảng tương ứng
        //     var userRole = await _context.UserRoles
        //         .Include(ur => ur.Role)
        //         .FirstOrDefaultAsync(ur => ur.UserId == id);

        //     if (userRole != null)
        //     {
        //         switch (userRole.Role.Name.ToLower())
        //         {
        //             case "admin":
        //                 var admin = await _context.Admins.FirstOrDefaultAsync(a => a.UserId == id);
        //                 if (admin != null)
        //                 {
        //                     admin.Name = updateUserDto.Name;
        //                     admin.Birth = updateUserDto.Birth;
        //                     admin.Gender = updateUserDto.Gender;
        //                     admin.Email = updateUserDto.Email;
        //                     admin.Phone = updateUserDto.phoneNumber;
        //                     admin.Address = updateUserDto.Address;
        //                     admin.Avatar = updateUserDto.Avatar;
        //                 }
        //                 break;

        //             case "staff":
        //                 var staff = await _context.Staff.FirstOrDefaultAsync(s => s.UserId == id);
        //                 if (staff != null)
        //                 {
        //                     staff.Name = updateUserDto.Name;
        //                     staff.Birth = updateUserDto.Birth;
        //                     staff.Gender = updateUserDto.Gender;
        //                     staff.Email = updateUserDto.Email;
        //                     staff.Phone = updateUserDto.phoneNumber;
        //                     staff.Address = updateUserDto.Address;
        //                     staff.Avatar = updateUserDto.Avatar;
        //                 }
        //                 break;

        //             case "customer":
        //                 var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == id);
        //                 if (customer != null)
        //                 {
        //                     customer.Name = updateUserDto.Name;
        //                     customer.Birth = updateUserDto.Birth;
        //                     customer.gender = updateUserDto.Gender;
        //                     customer.Email = updateUserDto.Email;
        //                     customer.Phone = updateUserDto.phoneNumber;
        //                     customer.Address = updateUserDto.Address;
        //                     customer.Avatar = updateUserDto.Avatar;
        //                 }
        //                 break;
        //         }
        //     }

        //     await _context.SaveChangesAsync();

        //     return user;
        // }
        
        // public async Task<User> DeleteUser(int id)
        // {
        //     var user = await _context.User.FindAsync(id);

        //     if (user == null)
        //     {
        //         throw new Result("Không tìm thấy user cần xóa");
        //     }

        //     // Tìm role của user để xóa từ bảng tương ứng
        //     var userRole = await _context.UserRoles
        //         .Include(ur => ur.Role)
        //         .FirstOrDefaultAsync(ur => ur.UserId == id);

        //     if (userRole != null)
        //     {
        //         switch (userRole.Role.Name.ToLower())
        //         {
        //             case "admin":
        //                 var admin = await _context.Admins.FirstOrDefaultAsync(a => a.UserId == id);
        //                 if (admin != null)
        //                 {
        //                     _context.Admins.Remove(admin);
        //                 }
        //                 break;

        //             case "staff":
        //                 var staff = await _context.Staff.FirstOrDefaultAsync(s => s.UserId == id);
        //                 if (staff != null)
        //                 {
        //                     _context.Staff.Remove(staff);
        //                 }
        //                 break;

        //             case "customer":
        //                 var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == id);
        //                 if (customer != null)
        //                 {
        //                     _context.Customers.Remove(customer);
        //                 }
        //                 break;
        //         }

        //         // Xóa UserRole
        //         _context.UserRoles.Remove(userRole);
        //     }

        //     // Xóa User
        //     _context.User.Remove(user);
        //     await _context.SaveChangesAsync();

        //     return user;
        // }
    }
}