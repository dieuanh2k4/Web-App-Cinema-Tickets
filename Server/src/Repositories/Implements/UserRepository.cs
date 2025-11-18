using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Models;
using Server.src.Repositories.Interfaces;

namespace Server.src.Repositories.Implements
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.User.FirstOrDefaultAsync(u => u.username == username);
        }
    }
}
