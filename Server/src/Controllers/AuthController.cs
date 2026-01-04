using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Data;
using Server.src.Dtos.Auth;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ApiControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;
        private readonly IMinioStorageService _minio;

        public AuthController(ApplicationDbContext context, IAuthService authService, IMinioStorageService minio, ILogger<AuthController> logger) : base(logger)
        {
            _context = context;
            _authService = authService;
            _minio = minio;
        }
        
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.IsSuccess)
                return BadRequest(result);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("customer-register")]
        public async Task<IActionResult> Register([FromForm] RegisterDto register, IFormFile? imageFile)
        {
            try
            {
                // Upload avatar nếu có
                if (imageFile != null)
                {
                    try
                    {
                        // Chỉ lưu path vào DB: cinebook/images/abc.jpg
                        var imagePath = await _minio.UploadImageAsync(imageFile);
                        register.Avatar = imagePath;
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nhưng vẫn cho phép đăng ký mà không có avatar
                        Console.WriteLine($"Lỗi upload avatar: {ex.Message}");
                        register.Avatar = null;
                    }
                }

                var newUser = await _authService.RegisterAsync(register);
                
                return Ok(new { 
                    message = "Đăng ký thành công",
                    user = newUser 
                });  
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi: " + ex.Message });
            }
        }

        // [HttpPost("forgot-password")]
        // public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        // {
        //     var result = await _authService.SendOTPAsync(request.Email);
        //     if (!result.IsSuccess)
        //         return BadRequest(result);
        //     return Ok(result);
        // }

        // [HttpPost("verify-otp")]
        // public async Task<IActionResult> VerifyOTP([FromBody] VerifyOTPRequestDto request)
        // {
        //     var result = await _authService.VerifyOTPAsync(request.Email, request.Otp);
        //     if (!result.IsSuccess)
        //         return BadRequest(result);
        //     return Ok(result);
        // }

        // [HttpPost("reset-password")]
        // public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        // {
        //     var result = await _authService.ResetPasswordAsync(request.Email, request.Otp, request.NewPassword);
        //     if (!result.IsSuccess)
        //         return BadRequest(result);
        //     return Ok(result);
        // }

        /// <summary>
        /// Verify JWT token và lấy thông tin user hiện tại
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var username = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
            var role = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(role))
            {
                return Unauthorized(new { message = "Token không hợp lệ" });
            }

            return Ok(new
            {
                username = username,
                role = role,
                userId = userIdClaim != null && int.TryParse(userIdClaim, out int uid) ? uid : (int?)null
            });
        }
    }
}
