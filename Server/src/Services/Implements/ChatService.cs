using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Server.src.Data;
using Server.src.Services.Interfaces;

namespace Server.src.Services.Implements
{
    public class ChatService : IChatService
    {
        private readonly ApplicationDbContext _context;

        public ChatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ChatResponse> ProcessMessage(string message, string? userId)
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
