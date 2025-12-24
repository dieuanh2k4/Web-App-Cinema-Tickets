namespace Server.src.Services.Interfaces
{
    public interface IChatService
    {
        Task<ChatResponse> ProcessMessage(string message, string? userId);
    }

    public class ChatResponse
    {
        public string Reply { get; set; } = string.Empty;
        public List<string> Suggestions { get; set; } = new();
        public string? Action { get; set; }
        public object? Data { get; set; }
    }
}
