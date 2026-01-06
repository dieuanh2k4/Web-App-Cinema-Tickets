namespace Server.src.Services.Interfaces;

public interface IChatService
{
    Task<string> ChatWithAIAsync(string message);
}
