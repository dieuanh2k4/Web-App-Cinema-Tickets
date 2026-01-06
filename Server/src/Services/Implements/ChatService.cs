using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Services.Interfaces;
using System.Text.Json;

namespace Server.src.Services.Implements
{
    public class ChatService : IChatService
    {
        private readonly ApplicationDbContext _context;
        private readonly IOpenAIService _openAIService;

        public ChatService(ApplicationDbContext context, IOpenAIService openAIService)
        {
            _context = context;
            _openAIService = openAIService;
        }

        public async Task<ChatResponse> ProcessMessage(string message, string? userId)
        {
            var lowerMessage = message.ToLower().Trim();

            try
            {
                // Build context data from database
                var contextData = await BuildContextData(lowerMessage);
                
                // Get OpenAI response with context
                var aiReply = await _openAIService.GetChatCompletionWithContext(message, contextData);
                
                // Generate smart suggestions based on message
                var suggestions = GenerateSuggestions(lowerMessage);
                
                return new ChatResponse
                {
                    Reply = aiReply,
                    Suggestions = suggestions
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ChatService: {ex.Message}");
                // Fallback to rule-based responses if OpenAI fails
                return await GetRuleBasedResponse(message, userId);
            }
        }

        private async Task<string> BuildContextData(string message)
        {
            var context = new System.Text.StringBuilder();
            var lowerMessage = message.ToLower();

            // 1. Always include current movies info if asking about movies
            if (ContainsAny(lowerMessage, new[] { "phim", "movie", "xem", "chiếu" }))
            {
                var movies = await _context.Movies
                    .Where(m => m.StartDate <= DateTime.UtcNow && m.EndDate >= DateTime.UtcNow)
                    .Select(m => new
                    {
                        m.Title,
                        m.Genre,
                        m.Duration,
                        m.AgeLimit,
                        m.Rating,
                        m.Description,
                        m.Director,
                        m.Actors,
                        m.Language,
                        Status = m.StartDate <= DateTime.UtcNow && m.EndDate >= DateTime.UtcNow ? "Đang chiếu" : "Sắp chiếu"
                    })
                    .Take(10)
                    .ToListAsync();

                if (movies.Any())
                {
                    context.AppendLine("=== PHIM ĐANG CHIẾU ===");
                    foreach (var m in movies)
                    {
                        context.AppendLine($"- {m.Title}");
                        context.AppendLine($"  Thể loại: {m.Genre} | Thời lượng: {m.Duration} phút");
                        context.AppendLine($"  Giới hạn tuổi: {m.AgeLimit} | Đánh giá: {m.Rating}/10");
                        context.AppendLine($"  Đạo diễn: {m.Director}");
                        if (m.Actors != null && m.Actors.Any())
                        {
                            context.AppendLine($"  Diễn viên: {string.Join(", ", m.Actors)}");
                        }
                        context.AppendLine($"  Mô tả: {m.Description}");
                        context.AppendLine();
                    }
                }
            }

            // 2. Theater information
            if (ContainsAny(lowerMessage, new[] { "rạp", "theater", "cinema", "địa chỉ", "ở đâu" }))
            {
                var theaters = await _context.Theater
                    .Select(t => new { t.Name, t.Address, t.City })
                    .Take(10)
                    .ToListAsync();

                if (theaters.Any())
                {
                    context.AppendLine("=== THÔNG TIN RẠP CHIẾU ===");
                    foreach (var t in theaters)
                    {
                        context.AppendLine($"- {t.Name}: {t.Address}, {t.City}");
                    }
                    context.AppendLine();
                }
            }

            // 3. Showtime information
            if (ContainsAny(lowerMessage, new[] { "lịch chiếu", "suất chiếu", "giờ chiếu", "showtime" }))
            {
                var today = DateTime.Today;
                var showtimes = await _context.Showtimes
                    .Where(s => s.Date >= DateOnly.FromDateTime(today))
                    .Include(s => s.Movies)
                    .Include(s => s.Rooms)
                    .ThenInclude(r => r!.Theater)
                    .Take(20)
                    .Select(s => new
                    {
                        MovieTitle = s.Movies!.Title,
                        Date = s.Date,
                        StartTime = s.Start,
                        TheaterName = s.Rooms!.Theater!.Name,
                        RoomName = s.Rooms.Name
                    })
                    .ToListAsync();

                if (showtimes.Any())
                {
                    context.AppendLine("=== LỊCH CHIẾU ===");
                    foreach (var s in showtimes.GroupBy(x => x.MovieTitle).Take(5))
                    {
                        context.AppendLine($"Phim: {s.Key}");
                        foreach (var show in s.Take(5))
                        {
                            context.AppendLine($"  - {show.Date:dd/MM/yyyy} {show.StartTime} tại {show.TheaterName} ({show.RoomName})");
                        }
                    }
                    context.AppendLine();
                }
            }

            // 4. Pricing information
            if (ContainsAny(lowerMessage, new[] { "giá", "vé", "tiền", "cost", "price" }))
            {
                context.AppendLine("=== BẢNG GIÁ VÉ ===");
                context.AppendLine("- Ghế Standard: 100.000₫");
                context.AppendLine("- Ghế VIP (hàng A, B, C): 150.000₫");
                context.AppendLine();
                context.AppendLine("ƯU ĐÃI:");
                context.AppendLine("- Giảm 20% cho suất chiếu trước 17h (Thứ 2-5)");
                context.AppendLine("- Giảm 15% cho thành viên VIP");
                context.AppendLine();
            }

            // 5. Booking process
            if (ContainsAny(lowerMessage, new[] { "đặt vé", "booking", "đặt", "mua vé" }))
            {
                context.AppendLine("=== QUY TRÌNH ĐẶT VÉ ===");
                context.AppendLine("1. Chọn phim bạn muốn xem từ danh sách phim đang chiếu");
                context.AppendLine("2. Chọn rạp chiếu và suất chiếu phù hợp");
                context.AppendLine("3. Chọn ghế ngồi (màu xanh là ghế trống, màu đỏ là đã có người đặt)");
                context.AppendLine("4. Điền thông tin liên hệ (họ tên, email, số điện thoại)");
                context.AppendLine("5. Thanh toán qua VNPay, Momo hoặc ZaloPay");
                context.AppendLine("6. Nhận mã QR vé qua email sau khi thanh toán thành công");
                context.AppendLine("7. Đưa mã QR tại quầy rạp để nhận vé");
                context.AppendLine();
                context.AppendLine("LƯU Ý:");
                context.AppendLine("- Ghế sẽ được giữ trong 10 phút sau khi chọn");
                context.AppendLine("- Vui lòng hoàn tất thanh toán trong thời gian này");
                context.AppendLine("- Có thể hủy đặt vé trước 2 giờ trước suất chiếu");
                context.AppendLine();
            }

            // 6. Payment methods
            if (ContainsAny(lowerMessage, new[] { "thanh toán", "payment", "vnpay", "momo", "zalopay" }))
            {
                context.AppendLine("=== PHƯƠNG THỨC THANH TOÁN ===");
                context.AppendLine("- VNPay (QR Code / Thẻ ATM / Internet Banking)");
                context.AppendLine("- Momo");
                context.AppendLine("- ZaloPay");
                context.AppendLine("- Thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard)");
                context.AppendLine();
                context.AppendLine("BẢO MẬT: Tất cả giao dịch được mã hóa SSL 256-bit");
                context.AppendLine("HOÀN TIỀN: 100% trong vòng 24h nếu có sự cố");
                context.AppendLine();
            }

            return context.ToString();
        }

        private List<string> GenerateSuggestions(string message)
        {
            var lowerMessage = message.ToLower();

            if (ContainsAny(lowerMessage, new[] { "phim", "movie" }))
            {
                return new List<string> { "Lịch chiếu hôm nay", "Giá vé bao nhiêu?", "Rạp nào gần tôi?" };
            }

            if (ContainsAny(lowerMessage, new[] { "giá", "vé", "tiền" }))
            {
                return new List<string> { "Có ưu đãi gì không?", "Đặt vé ngay", "Xem phim đang chiếu" };
            }

            if (ContainsAny(lowerMessage, new[] { "rạp", "địa chỉ" }))
            {
                return new List<string> { "Lịch chiếu", "Đặt vé online", "Xem phim hot" };
            }

            if (ContainsAny(lowerMessage, new[] { "đặt", "booking" }))
            {
                return new List<string> { "Xem phim đang chiếu", "Giá vé", "Phương thức thanh toán" };
            }

            return new List<string> { "Phim gì đang chiếu?", "Giá vé bao nhiêu?", "Hướng dẫn đặt vé", "Rạp gần tôi" };
        }

        private async Task<ChatResponse> GetRuleBasedResponse(string message, string? userId)
        {
            var lowerMessage = message.ToLower().Trim();

            // 1. Phim đang chiếu
            if (ContainsAny(lowerMessage, new[] { "phim", "chiếu", "xem", "phim gì", "có phim" }))
            {
                var movies = await _context.Movies
                    .Where(m => m.StartDate <= DateTime.UtcNow && m.EndDate >= DateTime.UtcNow)
                    .Take(5)
                    .ToListAsync();

                if (movies.Any())
                {
                    var movieList = string.Join("\n", movies.Select((m, i) =>
                        $"{i + 1}. 🎬 {m.Title} - {m.Genre} ({m.AgeLimit}) ⭐ {m.Rating}/10"));

                    return new ChatResponse
                    {
                        Reply = $"Hiện tại có {movies.Count} phim đang chiếu:\n\n{movieList}\n\nBạn muốn xem chi tiết phim nào?",
                        Suggestions = new List<string> { "Giá vé bao nhiêu?", "Lịch chiếu hôm nay", "Rạp nào gần tôi?" }
                    };
                }
                return new ChatResponse
                {
                    Reply = "Hiện tại chưa có phim nào đang chiếu. Vui lòng quay lại sau nhé!",
                    Suggestions = new List<string> { "Xem phim sắp chiếu" }
                };
            }

            // 2. Giá vé
            if (ContainsAny(lowerMessage, new[] { "giá", "vé", "tiền", "bao nhiêu", "phí" }))
            {
                return new ChatResponse
                {
                    Reply = "💰 **Bảng giá vé CineBook:**\n\n" +
                            "• Ghế Thường: 70.000₫\n" +
                            "• Ghế VIP: 100.000₫\n" +
                            "• Ghế IMAX: 150.000₫\n\n" +
                            "⏰ Giảm 20% cho suất chiếu trước 17h (Thứ 2-5)\n" +
                            "🎉 Giảm 15% cho thành viên VIP",
                    Suggestions = new List<string> { "Đặt vé ngay", "Xem phim đang chiếu", "Ưu đãi thành viên" }
                };
            }

            // 3. Rạp chiếu
            if (ContainsAny(lowerMessage, new[] { "rạp", "cinema", "địa chỉ", "gần", "ở đâu" }))
            {
                var theaters = await _context.Theater.Take(6).ToListAsync();

                if (theaters.Any())
                {
                    var theaterList = string.Join("\n", theaters.Select((t, i) =>
                        $"{i + 1}. 📍 {t.Name}\n   {t.Address}, {t.City}"));

                    return new ChatResponse
                    {
                        Reply = $"**Hệ thống rạp CineBook:**\n\n{theaterList}\n\nBạn muốn xem lịch chiếu tại rạp nào?",
                        Suggestions = new List<string> { "Lịch chiếu hôm nay", "Đặt vé online" }
                    };
                }
            }

            // 4. Lịch chiếu
            if (ContainsAny(lowerMessage, new[] { "lịch chiếu", "suất chiếu", "giờ chiếu", "hôm nay", "ngày mai" }))
            {
                var today = DateTime.Today;
                var showtimeCount = await _context.Showtimes
                    .Where(s => s.Date == DateOnly.FromDateTime(today))
                    .CountAsync();

                if (showtimeCount > 0)
                {
                    return new ChatResponse
                    {
                        Reply = $"📅 Hôm nay có {showtimeCount} suất chiếu.\n\n" +
                                "Để xem chi tiết lịch chiếu, vui lòng:\n" +
                                "1. Vào trang 'Lịch chiếu phim'\n" +
                                "2. Chọn ngày và rạp\n" +
                                "3. Chọn suất chiếu phù hợp\n\n" +
                                "Tôi có thể giúp gì thêm?",
                        Suggestions = new List<string> { "Xem lịch chiếu", "Phim hot nhất", "Đặt vé" }
                    };
                }
            }

            // 5. Đặt vé
            if (ContainsAny(lowerMessage, new[] { "đặt vé", "mua vé", "booking", "book" }))
            {
                return new ChatResponse
                {
                    Reply = "🎟️ **Hướng dẫn đặt vé online:**\n\n" +
                            "1. Chọn phim bạn muốn xem\n" +
                            "2. Chọn rạp và suất chiếu\n" +
                            "3. Chọn ghế ngồi\n" +
                            "4. Điền thông tin và thanh toán\n" +
                            "5. Nhận mã QR vé qua email\n\n" +
                            "💡 Mẹo: Đặt vé sớm để có ghế vị trí đẹp nhất!",
                    Suggestions = new List<string> { "Xem phim đang chiếu", "Tra cứu vé đã đặt", "Hỗ trợ thanh toán" }
                };
            }

            // 6. Phim hot/đáng xem
            if (ContainsAny(lowerMessage, new[] { "hot", "đáng xem", "hay", "recommend", "gợi ý" }))
            {
                var topMovies = await _context.Movies
                    .Where(m => m.StartDate <= DateTime.UtcNow && m.EndDate >= DateTime.UtcNow)
                    .OrderByDescending(m => m.Rating)
                    .Take(3)
                    .ToListAsync();

                if (topMovies.Any())
                {
                    var movieList = string.Join("\n", topMovies.Select((m, i) =>
                        $"{i + 1}. ⭐ **{m.Title}** ({m.Rating}/10)\n   {m.Genre} • {m.Duration} phút"));

                    return new ChatResponse
                    {
                        Reply = $"🔥 **Top phim đáng xem nhất:**\n\n{movieList}\n\nBạn muốn xem chi tiết phim nào?",
                        Suggestions = new List<string> { "Đặt vé ngay", "Xem trailer", "Giá vé bao nhiêu?" }
                    };
                }
            }

            // 7. Thanh toán
            if (ContainsAny(lowerMessage, new[] { "thanh toán", "payment", "vnpay", "momo", "atm" }))
            {
                return new ChatResponse
                {
                    Reply = "💳 **Phương thức thanh toán:**\n\n" +
                            "✅ VNPay (QR Code/Thẻ ATM)\n" +
                            "✅ Momo\n" +
                            "✅ ZaloPay\n" +
                            "✅ Thẻ tín dụng/ghi nợ\n\n" +
                            "🔒 Bảo mật SSL 256-bit\n" +
                            "💯 Hoàn tiền 100% nếu có sự cố",
                    Suggestions = new List<string> { "Đặt vé ngay", "Chính sách hoàn vé" }
                };
            }

            // 8. Hỗ trợ chung
            if (ContainsAny(lowerMessage, new[] { "help", "hỗ trợ", "giúp", "trợ giúp" }))
            {
                return new ChatResponse
                {
                    Reply = "🤖 **Tôi có thể giúp bạn:**\n\n" +
                            "• Tìm kiếm phim đang chiếu\n" +
                            "• Xem lịch chiếu và giá vé\n" +
                            "• Hướng dẫn đặt vé online\n" +
                            "• Thông tin rạp chiếu\n" +
                            "• Gợi ý phim hay\n" +
                            "• Tra cứu đơn hàng\n\n" +
                            "Bạn muốn hỏi về vấn đề gì?",
                    Suggestions = new List<string> { "Phim đang chiếu", "Giá vé", "Rạp gần tôi", "Đặt vé" }
                };
            }

            // 9. Chào hỏi
            if (ContainsAny(lowerMessage, new[] { "hello", "hi", "xin chào", "chào", "hey" }))
            {
                return new ChatResponse
                {
                    Reply = "Xin chào! 👋 Tôi là CineBot, trợ lý ảo của CineBook.\n\n" +
                            "Tôi có thể giúp bạn tìm phim, xem lịch chiếu, và đặt vé nhanh chóng.\n\n" +
                            "Bạn cần tôi hỗ trợ điều gì?",
                    Suggestions = new List<string> { "Phim đang chiếu", "Giá vé", "Rạp gần tôi", "Đặt vé ngay" }
                };
            }

            // 10. Cảm ơn
            if (ContainsAny(lowerMessage, new[] { "cảm ơn", "thank", "thanks", "ok", "được rồi" }))
            {
                return new ChatResponse
                {
                    Reply = "Rất vui được hỗ trợ bạn! 😊\n\n" +
                            "Nếu cần thêm trợ giúp, đừng ngại chat với tôi nhé!\n\n" +
                            "Chúc bạn có trải nghiệm xem phim tuyệt vời! 🎬🍿",
                    Suggestions = new List<string> { "Xem thêm phim", "Đặt vé" }
                };
            }

            // Default response
            return new ChatResponse
            {
                Reply = "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. 🤔\n\n" +
                        "Bạn có thể hỏi tôi về:\n" +
                        "• Phim đang chiếu\n" +
                        "• Lịch chiếu và giá vé\n" +
                        "• Địa chỉ rạp\n" +
                        "• Cách đặt vé\n\n" +
                        "Hoặc chọn câu hỏi gợi ý bên dưới nhé!",
                Suggestions = new List<string> { "Phim gì đang chiếu?", "Giá vé bao nhiêu?", "Rạp nào gần tôi?", "Hướng dẫn đặt vé" }
            };
        }

        private bool ContainsAny(string text, string[] keywords)
        {
            return keywords.Any(keyword => text.Contains(keyword));
        }
    }
}
