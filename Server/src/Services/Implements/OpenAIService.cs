using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _model;
        private const string API_URL = "https://api.openai.com/v1/chat/completions";

        public OpenAIService(IConfiguration configuration, HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = configuration["OpenAI:ApiKey"] ?? throw new Exception("OpenAI API Key not configured");
            _model = configuration["OpenAI:Model"] ?? "gpt-4o-mini"; // Default to gpt-4o-mini for cost efficiency
            
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<string> GetChatCompletion(string userMessage, List<ChatMessage> conversationHistory)
        {
            try
            {
                var messages = new List<object>
                {
                    new
                    {
                        role = "system",
                        content = "Bạn là CineBot, trợ lý ảo thông minh của CineBook - hệ thống đặt vé xem phim online. " +
                                  "Nhiệm vụ của bạn là hỗ trợ người dùng về: phim đang chiếu, lịch chiếu, giá vé, cách đặt vé, thông tin rạp chiếu. " +
                                  "Hãy trả lời một cách thân thiện, chuyên nghiệp và ngắn gọn. " +
                                  "Sử dụng emoji phù hợp để làm cho cuộc trò chuyện sinh động hơn. " +
                                  "Nếu không chắc chắn về thông tin, hãy thành thật và hướng dẫn người dùng cách tìm thông tin chính xác."
                    }
                };

                // Add conversation history
                foreach (var msg in conversationHistory)
                {
                    messages.Add(new { role = msg.Role, content = msg.Content });
                }

                // Add current user message
                messages.Add(new { role = "user", content = userMessage });

                var requestBody = new
                {
                    model = _model,
                    messages = messages,
                    temperature = 0.7,
                    max_tokens = 500
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(API_URL, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"OpenAI API error: {response.StatusCode} - {responseContent}");
                }

                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                var reply = result
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return reply ?? "Xin lỗi, tôi không thể xử lý yêu cầu này.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OpenAI Service Error: {ex.Message}");
                throw new Exception("Không thể kết nối với OpenAI. Vui lòng thử lại sau.");
            }
        }

        public async Task<string> GetChatCompletionWithContext(string userMessage, string contextData)
        {
            try
            {
                var messages = new List<object>
                {
                    new
                    {
                        role = "system",
                        content = "Bạn là CineBot, trợ lý ảo thông minh của CineBook - hệ thống đặt vé xem phim online. " +
                                  "Bạn có quyền truy cập vào dữ liệu thực tế của hệ thống. " +
                                  "Hãy sử dụng dữ liệu được cung cấp để trả lời chính xác câu hỏi của người dùng. " +
                                  "Trả lời ngắn gọn, thân thiện và chuyên nghiệp. Sử dụng emoji phù hợp. " +
                                  "Nếu dữ liệu không đủ để trả lời, hãy thành thật nói và hướng dẫn người dùng."
                    },
                    new
                    {
                        role = "system",
                        content = $"DỮ LIỆU HỆ THỐNG:\n{contextData}"
                    },
                    new
                    {
                        role = "user",
                        content = userMessage
                    }
                };

                var requestBody = new
                {
                    model = _model,
                    messages = messages,
                    temperature = 0.7,
                    max_tokens = 600
                };

                var jsonContent = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(API_URL, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"OpenAI API error: {response.StatusCode} - {responseContent}");
                }

                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
                var reply = result
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return reply ?? "Xin lỗi, tôi không thể xử lý yêu cầu này.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"OpenAI Service Error: {ex.Message}");
                throw new Exception("Không thể kết nối với OpenAI. Vui lòng thử lại sau.");
            }
        }
    }
}
