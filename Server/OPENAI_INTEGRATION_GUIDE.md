# 🤖 HƯỚNG DẪN TÍCH HỢP OPENAI CHO CHATBOT CINEBOOK

## 📋 Tổng quan

Hệ thống chatbot của CineBook đã được nâng cấp để tích hợp **OpenAI GPT-4o-mini**, cho phép chatbot trả lời thông minh dựa trên dữ liệu thực tế từ database.

## ✨ Tính năng mới

### 1. **Trả lời thông minh với OpenAI**
- Chatbot sử dụng GPT-4o-mini để hiểu ngữ cảnh và trả lời tự nhiên
- Tích hợp RAG (Retrieval Augmented Generation) để truy vấn dữ liệu real-time
- Fallback về rule-based nếu OpenAI gặp lỗi

### 2. **Dữ liệu được tích hợp**
- ✅ **Phim đang chiếu**: Title, thể loại, thời lượng, đánh giá, đạo diễn, diễn viên
- ✅ **Lịch chiếu**: Ngày, giờ, rạp, phòng chiếu
- ✅ **Rạp chiếu**: Tên rạp, địa chỉ, thành phố
- ✅ **Giá vé**: Standard, VIP, ưu đãi
- ✅ **Quy trình đặt vé**: Hướng dẫn chi tiết từng bước
- ✅ **Thanh toán**: Phương thức, bảo mật, hoàn tiền

### 3. **Smart Context Building**
Chatbot tự động xây dựng context dựa trên câu hỏi:
- Hỏi về phim → Load danh sách phim đang chiếu
- Hỏi về lịch chiếu → Load showtimes trong 7 ngày tới
- Hỏi về rạp → Load thông tin theater
- Hỏi về giá vé → Load bảng giá và ưu đãi

## 🚀 Cài đặt

### Bước 1: Cài đặt dependencies (Backend)

Không cần thêm package vì đã sử dụng `HttpClient` có sẵn trong .NET.

### Bước 2: Cấu hình OpenAI API Key

#### 2.1. Lấy API Key từ OpenAI
1. Truy cập: https://platform.openai.com/api-keys
2. Đăng nhập/Đăng ký tài khoản
3. Tạo API Key mới
4. Copy API Key (chỉ hiển thị 1 lần)

#### 2.2. Cập nhật file config

**File: `Server/appsettings.json`**
```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-xxxxxxxxxxxxxxxxxxxxx",
    "Model": "gpt-4o-mini"
  }
}
```

**File: `Server/appsettings.Development.json`**
```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-xxxxxxxxxxxxxxxxxxxxx",
    "Model": "gpt-4o-mini"
  }
}
```

> ⚠️ **LƯU Ý**: Không commit API Key lên Git! Thêm vào `.gitignore` hoặc dùng Environment Variables.

#### 2.3. Sử dụng Environment Variables (Production)

```bash
# Windows
$env:OpenAI__ApiKey="sk-proj-xxxxxxxxxxxxxxxxxxxxx"
$env:OpenAI__Model="gpt-4o-mini"

# Linux/Mac
export OpenAI__ApiKey="sk-proj-xxxxxxxxxxxxxxxxxxxxx"
export OpenAI__Model="gpt-4o-mini"
```

### Bước 3: Chạy ứng dụng

```bash
# Backend
cd Server
dotnet restore
dotnet run

# Frontend (terminal khác)
cd cinebook-frontend
npm install
npm run dev
```

## 🧪 Testing

### Test 1: Hỏi về phim đang chiếu
```
User: "Có phim gì hay đang chiếu không?"
Bot: [Trả về danh sách phim với thông tin chi tiết]
```

### Test 2: Hỏi về lịch chiếu
```
User: "Lịch chiếu phim Avatar hôm nay?"
Bot: [Trả về các suất chiếu cụ thể với rạp và giờ]
```

### Test 3: Hỏi về giá vé
```
User: "Giá vé bao nhiêu và có ưu đãi gì không?"
Bot: [Trả về bảng giá và các chương trình khuyến mãi]
```

### Test 4: Hướng dẫn đặt vé
```
User: "Làm sao để đặt vé online?"
Bot: [Hướng dẫn chi tiết quy trình đặt vé từng bước]
```

## 📊 Kiến trúc hệ thống

```
┌─────────────┐
│  Frontend   │
│ (ChatBot)   │
└──────┬──────┘
       │ POST /api/Chat/send-message
       ▼
┌─────────────────────┐
│  ChatController     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   ChatService       │
│  ┌───────────────┐  │
│  │BuildContext   │  │ ◄─── Query database
│  │Data()         │  │
│  └───────┬───────┘  │
│          │          │
│          ▼          │
│  ┌───────────────┐  │
│  │OpenAIService  │  │
│  │GetCompletion()│  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │
           ▼
    ┌──────────────┐
    │  OpenAI API  │
    │ (GPT-4o-mini)│
    └──────────────┘
```

## 🔧 Cấu hình nâng cao

### Thay đổi model OpenAI

Trong `appsettings.json`:
```json
{
  "OpenAI": {
    "Model": "gpt-4o"  // Hoặc "gpt-4", "gpt-3.5-turbo"
  }
}
```

**So sánh models:**
- `gpt-4o-mini`: Nhanh, rẻ, phù hợp chatbot ($0.15/1M tokens)
- `gpt-4o`: Cân bằng giữa chất lượng và giá ($2.5/1M tokens)
- `gpt-4`: Chất lượng cao nhất ($30/1M tokens)

### Điều chỉnh tham số AI

Trong `OpenAIService.cs`:
```csharp
var requestBody = new
{
    model = _model,
    messages = messages,
    temperature = 0.7,  // 0-1: Độ sáng tạo (0=conservative, 1=creative)
    max_tokens = 600,   // Giới hạn độ dài câu trả lời
    top_p = 0.9         // Nucleus sampling
};
```

## 💰 Chi phí ước tính

Với GPT-4o-mini:
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens

**Ước tính:**
- 1 câu hỏi trung bình: ~500 tokens context + 200 tokens response = 700 tokens
- Chi phí: ~$0.0004 per conversation
- 1000 conversations/ngày: ~$12/tháng

## 🛡️ Bảo mật

### 1. Bảo vệ API Key
```bash
# .gitignore
appsettings.json
appsettings.Development.json
.env
```

### 2. Rate Limiting
Thêm vào `Program.cs`:
```csharp
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("chatbot", config =>
    {
        config.Window = TimeSpan.FromMinutes(1);
        config.PermitLimit = 10; // 10 requests/minute
    });
});
```

### 3. Input Validation
ChatService đã có validation cơ bản, có thể mở rộng:
```csharp
if (string.IsNullOrWhiteSpace(message) || message.Length > 500)
{
    throw new ArgumentException("Invalid message");
}
```

## 🐛 Troubleshooting

### Lỗi: "OpenAI API Key not configured"
✅ Kiểm tra `appsettings.json` có config OpenAI chưa
✅ Restart lại server sau khi cập nhật config

### Lỗi: "401 Unauthorized"
✅ API Key không hợp lệ hoặc hết hạn
✅ Kiểm tra credit trong tài khoản OpenAI

### Lỗi: "429 Too Many Requests"
✅ Vượt quota hoặc rate limit
✅ Nâng cấp plan hoặc đợi 1 phút

### Chatbot trả về fallback response
✅ Kiểm tra kết nối internet
✅ Xem logs trong console để debug
✅ Kiểm tra credit OpenAI còn hay không

## 📈 Monitoring

### Xem logs OpenAI
```csharp
// Trong OpenAIService.cs
Console.WriteLine($"OpenAI Request: {userMessage}");
Console.WriteLine($"OpenAI Response: {reply}");
Console.WriteLine($"Tokens used: {tokensUsed}");
```

### Dashboard OpenAI
Truy cập: https://platform.openai.com/usage
- Xem usage hàng ngày
- Chi phí thực tế
- Rate limit status

## 🎯 Roadmap

### Phase 1: ✅ Completed
- [x] Tích hợp OpenAI API
- [x] RAG với database context
- [x] Fallback rule-based
- [x] Smart suggestions

### Phase 2: 🚧 Coming Soon
- [ ] Conversation history (multi-turn)
- [ ] User preferences learning
- [ ] Image generation cho posters
- [ ] Voice input/output
- [ ] Multi-language support

### Phase 3: 💡 Future
- [ ] Fine-tuning model với data riêng
- [ ] A/B testing responses
- [ ] Analytics dashboard
- [ ] Integration với CRM

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- Email: support@cinebook.com
- GitHub Issues: [Link]
- Discord: [Link]

---

**Made with ❤️ by CineBook Team**
