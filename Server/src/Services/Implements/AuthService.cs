using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Auth;
using Server.src.Exceptions;
using Server.src.Models;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenHelper _jwtHelper;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, JwtTokenHelper jwtHelper, IConfiguration configuration)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
        }

        public async Task<AuthResult> LoginAsync(LoginRequestDto request)
        {
            // Tìm user theo username và include roles
            var user = await _context.User
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.username == request.Username);

            if (user == null)
                return AuthResult.Fail("Sai tài khoản hoặc mật khẩu");

            // Verify password
            if (!PasswordHelper.VerifyPassword(request.Password, user.password))
                return AuthResult.Fail("Sai tài khoản hoặc mật khẩu");

            // Lấy role đầu tiên của user (hoặc "User" nếu không có role)
            string role = user.UserRoles?.FirstOrDefault()?.Role?.Name ?? "User";

            var token = _jwtHelper.GenerateToken(user.username, role, user.Id);

            var response = new LoginResponseDto
            {
                Username = user.username,
                Role = role,
                Token = token
            };

            return AuthResult.Success(response, "Đăng nhập thành công");
        }

        // public async Task<Result> RegisterAsync(RegisterRequestDto request)
        // {
        //     // Kiểm tra username đã tồn tại
        //     var existingUser = await _context.User
        //         .FirstOrDefaultAsync(u => u.username == request.Username);

        //     if (existingUser != null)
        //         return Result.Fail("Tên đăng nhập đã tồn tại");

        //     // Kiểm tra email đã tồn tại trong Customer
        //     var existingCustomer = await _context.Customers
        //         .FirstOrDefaultAsync(c => c.Email == request.Email);

        //     if (existingCustomer != null)
        //         return Result.Fail("Email đã được sử dụng");

        //     // Hash password
        //     var hashedPassword = PasswordHelper.HashPassword(request.Password);

        //     // Tạo User mới
        //     var newUser = new User
        //     {
        //         username = request.Username,
        //         password = hashedPassword,
        //         userType = 1 // Mặc định là Staff/Customer
        //     };

        //     await _context.User.AddAsync(newUser);
        //     await _context.SaveChangesAsync();

        //     // Tạo Customer mới liên kết với User
        //     var newCustomer = new Customer
        //     {
        //         Name = request.Username,
        //         Email = request.Email,
        //         Phone = "0000000000", // Placeholder - có thể cập nhật sau
        //         Birth = DateTime.Now.AddYears(-18), // Placeholder
        //         UserId = newUser.Id
        //     };

        //     await _context.Customers.AddAsync(newCustomer);
        //     await _context.SaveChangesAsync();

        //     return Result.Ok("Đăng ký thành công");
        // }

        // public async Task<Result> SendOTPAsync(string email)
        // {
        //     // Kiểm tra email có tồn tại trong hệ thống
        //     var customer = await _context.Customers
        //         .FirstOrDefaultAsync(c => c.Email == email);

        //     if (customer == null)
        //         return Result.Fail("Email không tồn tại trong hệ thống");

        //     // Tạo mã OTP 6 số
        //     var random = new Random();
        //     var otpCode = random.Next(100000, 999999).ToString();

        //     // Lưu OTP vào database
        //     var otp = new OTPCode
        //     {
        //         Email = email,
        //         Code = otpCode,
        //         CreatedAt = DateTime.Now,
        //         ExpiresAt = DateTime.Now.AddMinutes(5), // OTP có hiệu lực 5 phút
        //         IsUsed = false
        //     };

        //     await _context.OTPCodes.AddAsync(otp);
        //     await _context.SaveChangesAsync();

        //     // Gửi email (cần cấu hình SMTP)
        //     try
        //     {
        //         await SendEmailAsync(email, "Mã OTP khôi phục mật khẩu", 
        //             $"Mã OTP của bạn là: <strong>{otpCode}</strong><br/>Mã này có hiệu lực trong 5 phút.");
        //     }
        //     catch (Exception ex)
        //     {
        //         // Nếu gửi email thất bại, vẫn trả về success để test (trong production nên trả về fail)
        //         Console.WriteLine($"Lỗi gửi email: {ex.Message}");
        //         // Để test: in mã OTP ra console
        //         Console.WriteLine($"OTP Code for {email}: {otpCode}");
        //     }

        //     return Result.Ok("Mã OTP đã được gửi đến email của bạn");
        // }

        // public async Task<Result> VerifyOTPAsync(string email, string otp)
        // {
        //     var otpRecord = await _context.OTPCodes
        //         .Where(o => o.Email == email && o.Code == otp && !o.IsUsed)
        //         .OrderByDescending(o => o.CreatedAt)
        //         .FirstOrDefaultAsync();

        //     if (otpRecord == null)
        //         return Result.Fail("Mã OTP không hợp lệ");

        //     if (otpRecord.ExpiresAt < DateTime.Now)
        //         return Result.Fail("Mã OTP đã hết hạn");

        //     return Result.Ok("Xác thực OTP thành công");
        // }

        // public async Task<Result> ResetPasswordAsync(string email, string otp, string newPassword)
        // {
        //     // Verify OTP
        //     var otpRecord = await _context.OTPCodes
        //         .Where(o => o.Email == email && o.Code == otp && !o.IsUsed)
        //         .OrderByDescending(o => o.CreatedAt)
        //         .FirstOrDefaultAsync();

        //     if (otpRecord == null)
        //         return Result.Fail("Mã OTP không hợp lệ");

        //     if (otpRecord.ExpiresAt < DateTime.Now)
        //         return Result.Fail("Mã OTP đã hết hạn");

        //     // Tìm customer và user
        //     var customer = await _context.Customers
        //         .FirstOrDefaultAsync(c => c.Email == email);

        //     if (customer == null || customer.UserId == null)
        //         return Result.Fail("Không tìm thấy tài khoản");

        //     var user = await _context.User
        //         .FirstOrDefaultAsync(u => u.Id == customer.UserId);

        //     if (user == null)
        //         return Result.Fail("Không tìm thấy tài khoản");

        //     // Đổi mật khẩu
        //     user.password = PasswordHelper.HashPassword(newPassword);

        //     // Đánh dấu OTP đã sử dụng
        //     otpRecord.IsUsed = true;

        //     await _context.SaveChangesAsync();

        //     return Result.Ok("Đổi mật khẩu thành công");
        // }

        private async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var fromEmail = _configuration["Email:FromEmail"];
            var password = _configuration["Email:Password"];

            if (string.IsNullOrEmpty(fromEmail) || string.IsNullOrEmpty(password))
            {
                throw new Exception("Email configuration is missing");
            }

            var smtpClient = new SmtpClient(smtpHost)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(fromEmail, password),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, "CINEBOOK"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}
