using System.Threading.Tasks;
using Server.src.Models;

namespace Server.src.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
    }
}
