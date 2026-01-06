using System.Text;
using System.Text.Json;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class ChatService : IChatService
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ChatService(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> ChatWithAIAsync(string message)
        {
            var client = _httpClientFactory.CreateClient("Groq");

            var payload = new
            {
                model = "llama-3.1-8b-instant",

                messages = new[]
                {
                    new { role = "system", content = "Bạn là trợ lý AI cho hệ thống đặt vé rạp phim." },
                    new { role = "user", content = message }
                },
                temperature = 0.7
            };

            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await client.PostAsync("chat/completions", content);

            var json = await response.Content.ReadAsStringAsync();

            // ✅ DEBUG CỰC QUAN TRỌNG
            if (!response.IsSuccessStatusCode)
            {
                return $"[Groq API Error] {json}";
            }

            using var doc = JsonDocument.Parse(json);

            // ✅ CHECK AN TOÀN
            if (!doc.RootElement.TryGetProperty("choices", out var choices) ||
                choices.GetArrayLength() == 0)
            {
                return "[Groq API Error] Response does not contain choices";
            }

            var choice = choices[0];

            if (!choice.TryGetProperty("message", out var messageObj) ||
                !messageObj.TryGetProperty("content", out var contentObj))
            {
                return "[Groq API Error] Response does not contain message content";
            }

            return contentObj.GetString() ?? "";
        }

    }
}
