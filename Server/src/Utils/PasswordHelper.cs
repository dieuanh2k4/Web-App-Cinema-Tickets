using System.Security.Cryptography;
using System.Text;

namespace Server.src.Utils
{
    public static class PasswordHelper
    {
        /// <summary>
        /// Hash password using MD5
        /// </summary>
        public static string HashPassword(string password)
        {
            using var md5 = MD5.Create();
            var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        /// <summary>
        /// Verify if input password matches hashed password
        /// </summary>
        public static bool VerifyPassword(string inputPassword, string hashedPassword)
        {
            var hash = HashPassword(inputPassword);
            return hash.Equals(hashedPassword, StringComparison.OrdinalIgnoreCase);
        }
    }
}
