using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Dtos.Auth;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.IsSuccess)
                return BadRequest(result);
            return Ok(result);
        }

        // [HttpPost("register")]
        // public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        // {
        //     var result = await _authService.RegisterAsync(request);
        //     if (!result.IsSuccess)
        //         return BadRequest(result);
        //     return Ok(result);
        // }

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
