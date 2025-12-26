# 🤖 AI Chatbot - CineBook Assistant

## Tổng quan
CineBot là trợ lý ảo thông minh được tích hợp vào hệ thống đặt vé xem phim CineBook. Bot có khả năng trả lời các câu hỏi về phim, lịch chiếu, giá vé, rạp chiếu và hỗ trợ khách hàng đặt vé.

---

## ✨ Tính năng chính

### 1. **Tìm kiếm phim đang chiếu**
- Liệt kê các phim đang chiếu với đầy đủ thông tin: Tiêu đề, thể loại, độ tuổi, đánh giá
- Gợi ý phim HOT dựa trên rating cao nhất
- Lọc phim theo thời gian chiếu (StartDate - EndDate)

### 2. **Tra cứu giá vé**
- Hiển thị bảng giá đầy đủ cho các loại ghế: Thường, VIP, IMAX
- Thông tin về các chương trình giảm giá:
  - Giảm 20% suất chiếu sáng (trước 17h, T2-T5)
  - Giảm 15% cho thành viên VIP

### 3. **Thông tin rạp chiếu**
- Liệt kê hệ thống rạp CineBook với địa chỉ chi tiết
- Hỗ trợ tìm rạp theo thành phố
- Hiển thị thông tin địa chỉ đầy đủ (Theater.Name, Address, City)

### 4. **Lịch chiếu phim**
- Tra cứu số lượng suất chiếu theo ngày
- Hướng dẫn khách hàng xem lịch chiếu chi tiết
- Tích hợp với hệ thống Showtimes

### 5. **Hỗ trợ đặt vé**
- Hướng dẫn quy trình đặt vé online chi tiết (5 bước)
- Tips đặt vé: Đặt sớm để có ghế đẹp
- Liên kết với trang booking

### 6. **Phương thức thanh toán**
- Thông tin các cổng thanh toán: VNPay, Momo, ZaloPay, Thẻ tín dụng
- Chính sách bảo mật SSL 256-bit
- Chính sách hoàn tiền 100%

### 7. **Gợi ý thông minh**
- Mỗi câu trả lời đi kèm 2-4 gợi ý câu hỏi tiếp theo
- Quick action buttons cho các câu hỏi phổ biến
- Ngữ cảnh đàm thoại tự nhiên

---

## 🏗️ Kiến trúc hệ thống

### **Backend (ASP.NET Core 8.0)**

#### 1. **ChatController.cs**
```csharp
[Route("api/[controller]")]
[ApiController]
public class ChatController : ApiControllerBase
{
    [AllowAnonymous]
    [HttpPost("send-message")]
    public async Task<IActionResult> SendMessage([FromBody] ChatMessageRequest request)
    {
        var response = await _chatService.ProcessMessage(request.Message, request.UserId);
        return Ok(response);
    }
}
```

#### 2. **IChatService Interface**
```csharp
public interface IChatService
{
    Task<ChatResponse> ProcessMessage(string message, string? userId);
}

public class ChatResponse
{
    public string Reply { get; set; }           // Nội dung trả lời
    public List<string> Suggestions { get; set; } // Gợi ý câu hỏi tiếp
    public string? Action { get; set; }         // Action type (future)
    public object? Data { get; set; }           // Structured data (future)
}
```

#### 3. **ChatService Implementation**
- **Rule-based NLP**: Phân tích từ khóa trong câu hỏi người dùng
- **Database Integration**: Truy vấn trực tiếp PostgreSQL để lấy dữ liệu real-time
- **Context Awareness**: Hiểu ngữ cảnh cinema domain (phim, rạp, vé)

**Các Pattern xử lý:**
1. **Phim đang chiếu**: `phim|chiếu|xem|phim gì|có phim`
2. **Giá vé**: `giá|vé|tiền|bao nhiêu|phí`
3. **Rạp chiếu**: `rạp|cinema|địa chỉ|gần|ở đâu`
4. **Lịch chiếu**: `lịch chiếu|suất chiếu|giờ chiếu|hôm nay|ngày mai`
5. **Đặt vé**: `đặt vé|mua vé|booking|book`
6. **Phim hot**: `hot|đáng xem|hay|recommend|gợi ý`
7. **Thanh toán**: `thanh toán|payment|vnpay|momo|atm`
8. **Chào hỏi**: `hello|hi|xin chào|chào|hey`

---

### **Frontend (React 19 + Vite)**

#### 1. **ChatBot Component Structure**
```jsx
<ChatBot>
  ├── Floating Button (Bottom-right, z-index: 50)
  │   ├── Icon: FiMessageCircle / FiX
  │   └── Online Indicator (green pulse)
  │
  ├── Chat Window (396px width, 600px height)
  │   ├── Header (Gradient purple)
  │   │   ├── CineBot Avatar
  │   │   ├── Title: "CineBot AI"
  │   │   └── Status: "Online"
  │   │
  │   ├── Messages Area (Scrollable)
  │   │   ├── User Messages (Purple bubble, right-aligned)
  │   │   ├── Bot Messages (Dark-lighter bubble, left-aligned)
  │   │   ├── Suggestions Chips (Interactive buttons)
  │   │   └── Typing Indicator (3 animated dots)
  │   │
  │   ├── Quick Actions (First message only)
  │   │   ├── 🎬 Phim đang chiếu
  │   │   ├── 🎟️ Giá vé
  │   │   ├── 📍 Rạp chiếu
  │   │   └── ⭐ Phim hot
  │   │
  │   └── Input Area
  │       ├── Text Input (Enter to send)
  │       └── Send Button (FiSend icon)
</ChatBot>
```

#### 2. **State Management**
```jsx
const [isOpen, setIsOpen] = useState(false)           // Chat window toggle
const [messages, setMessages] = useState([...])        // Message history
const [input, setInput] = useState('')                // User input
const [isTyping, setIsTyping] = useState(false)       // Typing indicator
```

#### 3. **TanStack Query Integration**
```jsx
const chatMutation = useMutation({
  mutationFn: sendChatMessage,
  onSuccess: (data) => {
    // Add bot response with suggestions
    setMessages(prev => [...prev, {
      type: 'bot',
      text: data.reply,
      suggestions: data.suggestions,
      timestamp: new Date()
    }])
  },
  onError: () => {
    // Error handling with user-friendly message
  }
})
```

---

## 🚀 Cách sử dụng

### **Cho End User**

1. **Mở Chatbot**
   - Click vào nút tròn màu tím ở góc dưới bên phải
   - Bot sẽ chào bạn với tin nhắn welcome

2. **Hỏi câu hỏi**
   - Gõ câu hỏi vào ô input
   - Hoặc click vào Quick Action buttons
   - Hoặc click vào Suggestion chips

3. **Nhận câu trả lời**
   - Bot trả lời ngay lập tức với thông tin chi tiết
   - Xem các gợi ý câu hỏi tiếp theo
   - Tiếp tục đàm thoại tự nhiên

### **Ví dụ hội thoại**

```
User: "Có phim gì đang chiếu?"
Bot: "Hiện tại có 5 phim đang chiếu:
      1. 🎬 Avengers: Endgame - Action (13+) ⭐ 8.5/10
      2. 🎬 The Lion King - Animation (P) ⭐ 7.8/10
      ...
      Bạn muốn xem chi tiết phim nào?"
Suggestions: [Giá vé bao nhiêu?] [Lịch chiếu hôm nay] [Rạp nào gần tôi?]

User: "Giá vé bao nhiêu?"
Bot: "💰 Bảng giá vé CineBook:
      • Ghế Thường: 70.000₫
      • Ghế VIP: 100.000₫
      • Ghế IMAX: 150.000₫
      
      ⏰ Giảm 20% cho suất chiếu trước 17h (Thứ 2-5)
      🎉 Giảm 15% cho thành viên VIP"
Suggestions: [Đặt vé ngay] [Xem phim đang chiếu] [Ưu đãi thành viên]
```

---

## 🔧 Cài đặt & Triển khai

### **Backend Setup**

1. **Thêm Service vào Program.cs**
```csharp
// Chat AI service
builder.Services.AddScoped<IChatService, ChatService>();
```

2. **Không cần migration** (Sử dụng models hiện có: Movies, Theaters, Showtimes)

3. **API Endpoint**
```
POST /api/Chat/send-message
Content-Type: application/json

Request:
{
  "message": "Có phim gì đang chiếu?",
  "userId": "optional-user-id"
}

Response:
{
  "reply": "Hiện tại có 5 phim đang chiếu...",
  "suggestions": ["Giá vé bao nhiêu?", "Lịch chiếu hôm nay"],
  "action": null,
  "data": null
}
```

### **Frontend Setup**

1. **Component đã được tích hợp vào Layout.jsx**
```jsx
import ChatBot from './ChatBot'

export default function Layout() {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatBot />  {/* Chatbot có sẵn trên mọi trang */}
    </>
  )
}
```

2. **API Service (api.js)**
```javascript
export const sendChatMessage = async (messageData) => {
  return api.post("/Chat/send-message", messageData);
};
```

---

## 🎨 Giao diện

### **Design System**
- **Color Palette**: 
  - Purple Primary: `#8B5CF6` (Gradient with `#7C3AED`)
  - Dark Background: `#111827`, `#1F2937`
  - White Text: `#F9FAFB`
  - Gray Accents: `#374151`, `#6B7280`

- **Typography**: 
  - Font: System UI / Tailwind Default
  - Sizes: xs (12px), sm (14px), base (16px), lg (18px)

- **Animations**:
  - Pulse animation for online indicator
  - Bounce animation for typing dots (3 dots with 0.1s delay)
  - Smooth scroll for message area
  - Transition-all for hover effects

### **Responsive Design**
- Desktop: Full width (384px = w-96)
- Mobile: Adapts to smaller screens (can be customized)
- Fixed position: bottom-right corner
- Z-index management: Button (50), Window (40)

---

## 🚧 Future Enhancements

### **Phase 2: Advanced AI**
1. **OpenAI GPT-4 Integration**
   - Natural language understanding
   - Context-aware conversations
   - Multi-turn dialogue management

2. **Machine Learning Features**
   - Personalized movie recommendations
   - User preference learning
   - Behavior analysis

### **Phase 3: Advanced Features**
1. **Booking Flow Integration**
   - Direct booking from chat
   - "Đặt vé cho Avengers lúc 19h tại CGV Vincom"
   - Payment within chat

2. **Voice Integration**
   - Speech-to-text input
   - Text-to-speech responses
   - Voice commands

3. **Multi-language Support**
   - English
   - Vietnamese (current)
   - Other languages

4. **Chat History & Analytics**
   - Save conversation history
   - User analytics dashboard
   - Popular questions report

### **Phase 4: Advanced NLP**
1. **Entity Recognition**
   - Extract movie names, theaters, dates from natural language
   - "Tôi muốn xem Avengers ở CGV Vincom vào 7h tối"

2. **Sentiment Analysis**
   - Detect user emotion (frustrated, happy, confused)
   - Adjust response tone accordingly

3. **Contextual Memory**
   - Remember previous questions in conversation
   - "Rạp đó có suất nào khác không?" (remember previous theater)

---

## 📊 Performance

### **Current Metrics**
- Average response time: < 500ms (database queries)
- Message history: Stored in-memory (React state)
- No external API calls (fully self-contained)

### **Optimization Tips**
1. **Caching**: Cache movie/theater data in Redis for faster responses
2. **Pagination**: Limit query results (Take(5) for movies, Take(6) for theaters)
3. **Indexing**: Ensure database indexes on Movies.StartDate, Movies.EndDate
4. **Lazy Loading**: Load old messages only when scrolling up

---

## 🐛 Debugging

### **Common Issues**

1. **API not responding**
   - Check if ChatService is registered in Program.cs
   - Verify API endpoint: `/api/Chat/send-message`
   - Check CORS settings

2. **Empty responses**
   - Check database connection
   - Verify Movies/Theaters data exists
   - Check DateOnly comparisons (UTC timezone)

3. **Frontend errors**
   - Verify TanStack Query setup
   - Check api.js import in ChatBot.jsx
   - Console.log API responses

### **Debug Logging**
```csharp
// Add to ChatService.cs
_logger.LogInformation($"Processing message: {message}");
_logger.LogInformation($"Found {movies.Count} movies");
```

---

## 📝 License
This chatbot is part of the CineBook Cinema Ticket Booking System.
© 2024 CineBook Team. All rights reserved.

---

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/chatbot-enhancement`
3. Commit changes: `git commit -m 'Add new chatbot feature'`
4. Push to branch: `git push origin feature/chatbot-enhancement`
5. Submit a Pull Request

---

## 📧 Support
For questions or issues, contact:
- Email: support@cinebook.com
- GitHub Issues: [Create an issue](https://github.com/cinebook/issues)
- Live Chat: Use the CineBot! 🤖
