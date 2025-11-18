using Server.src.Dtos.Auth;
using System.Threading.Tasks;

namespace Server.src.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync(LoginRequestDto request);
    }
}
