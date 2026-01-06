using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ApiControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(
            IChatService chatService,
            ILogger<ChatController> logger
        ) : base(logger)   // ✅ QUAN TRỌNG
        {
            _chatService = chatService;
        }

        [HttpPost("ai")]
        public async Task<IActionResult> ChatAI([FromBody] ChatAiRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message is required");

            var reply = await _chatService.ChatWithAIAsync(request.Message);
            return Ok(new { reply });
        }
    }

    public class ChatAiRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}
