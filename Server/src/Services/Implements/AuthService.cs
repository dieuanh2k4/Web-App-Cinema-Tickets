using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Dtos.Auth;
using Server.src.Services.Interfaces;
using Server.src.Utils;

namespace Server.src.Services.Implements
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, JwtTokenHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResult> LoginAsync(LoginRequestDto request)
        {
            // Hash password người dùng nhập vào
            var hashedPassword = PasswordHelper.HashPassword(request.Password);

            // Tìm user với username và password đã hash
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.username == request.Username && u.password == hashedPassword);

            if (user == null)
                return AuthResult.Fail("Sai tài khoản hoặc mật khẩu");

            string role = user.userType == 0 ? "Admin" : "Staff";

            var token = _jwtHelper.GenerateToken(user.username, role, user.Id);

            var response = new LoginResponseDto
            {
                Username = user.username,
                Role = role,
                Token = token
            };

            return AuthResult.Success(response, "Đăng nhập thành công");
        }
    }
}
