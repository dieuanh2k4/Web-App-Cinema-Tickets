using System.Linq;
using Microsoft.EntityFrameworkCore;
using Server.src.Models;
using System.Security.Cryptography;
using System.Text;

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
                        password = HashPassword("admin123"), // hash password
                        userType = 0 // Admin
                    },
                    new User
                    {
                        username = "staff",
                        password = HashPassword("staff123"),
                        userType = 1 // Staff
                    }
                };

                context.User.AddRange(users);
                context.SaveChanges();
            }
        }

        // Hàm hash mật khẩu đơn giản (MD5 hoặc SHA256)
        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }
    }
}
