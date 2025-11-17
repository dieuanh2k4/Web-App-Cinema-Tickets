namespace Server.src.Dtos.Auth
{
    public class AuthResult
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
        public LoginResponseDto? Data { get; set; }

        public static AuthResult Success(LoginResponseDto data, string? message = null)
        {
            return new AuthResult
            {
                IsSuccess = true,
                Data = data,
                Message = message
            };
        }

        public static AuthResult Fail(string message)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = message
            };
        }
    }
}
