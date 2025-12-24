using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.src.Services.Interfaces;

namespace Server.src.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ApiControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService, ILogger<ChatController> logger) : base(logger)
        {
            _chatService = chatService;
        }

        [AllowAnonymous]
        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest request)
        {
            try
            {
                var response = await _chatService.ProcessMessage(request.Message, request.UserId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return ReturnException(ex);
            }
        }
    }

    public class ChatMessageRequest
    {
        public string Message { get; set; } = string.Empty;
        public string? UserId { get; set; }
    }
}
