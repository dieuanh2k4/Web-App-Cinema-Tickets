using System.Collections.Generic;
using System.Threading.Tasks;

namespace Server.src.Services.Interfaces
{
    public interface IOpenAIService
    {
        Task<string> GetChatCompletion(string userMessage, List<ChatMessage> conversationHistory);
        Task<string> GetChatCompletionWithContext(string userMessage, string contextData);
    }

    public class ChatMessage
    {
        public string Role { get; set; } = string.Empty; // "user" or "assistant"
        public string Content { get; set; } = string.Empty;
    }
}
