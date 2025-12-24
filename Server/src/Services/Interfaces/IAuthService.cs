using Server.src.Dtos.Auth;
using Server.src.Exceptions;
using System.Threading.Tasks;

namespace Server.src.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequestDto request);
        // Task<Result> RegisterAsync(RegisterRequestDto request);
        // Task<Result> SendOTPAsync(string email);
        // Task<Result> VerifyOTPAsync(string email, string otp);
        // Task<Result> ResetPasswordAsync(string email, string otp, string newPassword);
    }
}
