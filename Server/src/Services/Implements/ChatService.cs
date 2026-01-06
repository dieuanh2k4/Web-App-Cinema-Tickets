using System.Text;
using System.Text.Json;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class ChatService : IChatService
    {
        private readonly IHttpClientFactory _httpClientFactory; // ⭐ Chat
        private readonly ICinemaRagService _ragService;          // ⭐ RAG

        // ⭐ DI: inject HttpClient + RAG service
        public ChatService(
            IHttpClientFactory httpClientFactory,
            ICinemaRagService ragService // ⭐ RAG
        )
        {
            _httpClientFactory = httpClientFactory;
            _ragService = ragService;
        }

        public async Task<string> ChatWithAIAsync(string message)
        {
            var client = _httpClientFactory.CreateClient("Groq"); // ⭐ Groq client

            // ⭐ RAG: build context từ database (ưu tiên phim)
            var context = await _ragService.BuildMovieContextAsync();

            var payload = new
            {
                model = "llama-3.1-8b-instant",

                messages = new[]
                {
                    // ⭐ SYSTEM PROMPT + CONTEXT
                    new
                    {
                        role = "system",
                        content =
@"You are an AI assistant for a cinema ticket booking system.

RULES:
- ONLY use information from CONTEXT.
- DO NOT invent data.
- If information is missing, say you cannot find it.

ANSWER FORMAT (BILINGUAL):
🇻🇳 Tiếng Việt:
<answer>

🇺🇸 English:
<answer>

CONTEXT:
" + context
                    },

                    // ⭐ USER MESSAGE
                    new
                    {
                        role = "user",
                        content = message
                    }
                },

                temperature = 0.2 // ⭐ RAG: giảm bịa
            };

            var httpContent = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await client.PostAsync("chat/completions", httpContent);
            var json = await response.Content.ReadAsStringAsync();

            // ⭐ DEBUG: trả lỗi Groq nếu có
            if (!response.IsSuccessStatusCode)
            {
                return $"[Groq API Error] {json}";
            }

            using var doc = JsonDocument.Parse(json);

            // ⭐ SAFETY CHECK
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
