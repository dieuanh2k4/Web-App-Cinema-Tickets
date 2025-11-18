using System.Linq;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;
using Server.src.Utils;

namespace Server.src.Data
{
    public static class DataSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            // Đảm bảo DB đã tồn tại
            context.Database.Migrate();

            // Nếu chưa có user nào -> thêm mới
            if (!context.User.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        username = "admin",
                        password = PasswordHelper.HashPassword("admin123"), // hash password
                        userType = 0 // Admin
                    },
                    new User
                    {
                        username = "staff",
                        password = PasswordHelper.HashPassword("staff123"),
                        userType = 1 // Staff
                    }
                };

                context.User.AddRange(users);
                context.SaveChanges();
            }
        }
    }
}