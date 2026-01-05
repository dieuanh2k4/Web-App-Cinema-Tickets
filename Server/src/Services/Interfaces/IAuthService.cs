using Server.src.Dtos.Auth;
using Server.src.Exceptions;
using Server.src.Models;
using System.Threading.Tasks;

namespace Server.src.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequestDto request);
        Task<User> RegisterAsync(RegisterDto register);
    }
}
