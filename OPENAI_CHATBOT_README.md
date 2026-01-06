# 🎬 CineBook - OpenAI Chatbot Integration

## ✨ Tính năng đã tích hợp

Chatbot CineBook hiện đã được nâng cấp với **OpenAI GPT-4o-mini** để trả lời thông minh dựa trên dữ liệu thực tế từ hệ thống.

### Chatbot có thể trả lời:
- ✅ Thông tin phim đang chiếu (title, thể loại, đánh giá, đạo diễn, diễn viên)
- ✅ Lịch chiếu cụ thể (ngày, giờ, rạp, phòng chiếu)
- ✅ Thông tin rạp chiếu (địa chỉ, thành phố)
- ✅ Giá vé và ưu đãi
- ✅ Hướng dẫn đặt vé chi tiết
- ✅ Phương thức thanh toán
- ✅ Gợi ý phim hay dựa trên rating

## 🚀 Cách sử dụng

### 1. Cấu hình OpenAI API Key

Tạo API key tại: https://platform.openai.com/api-keys

Cập nhật trong file config:

**Server/appsettings.json**
```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-YOUR_API_KEY_HERE",
    "Model": "gpt-4o-mini"
  }
}
```

**Server/appsettings.Development.json**
```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-YOUR_API_KEY_HERE",
    "Model": "gpt-4o-mini"
  }
}
```

### 2. Chạy ứng dụng

```bash
# Backend
cd Server
dotnet restore
dotnet run

# Frontend
cd cinebook-frontend
npm install
npm run dev
```

### 3. Test chatbot

Mở website → Click vào icon chatbot ở góc phải màn hình → Hỏi:
- "Có phim gì hay đang chiếu?"
- "Lịch chiếu hôm nay"
- "Giá vé bao nhiêu?"
- "Làm sao để đặt vé?"

## 📁 Files đã thay đổi

### Backend
- ✅ `Server/src/Services/Interfaces/IOpenAIService.cs` - Interface OpenAI service
- ✅ `Server/src/Services/Implements/OpenAIService.cs` - Implementation OpenAI API
- ✅ `Server/src/Services/Implements/ChatService.cs` - Tích hợp OpenAI + RAG context
- ✅ `Server/Program.cs` - Đăng ký OpenAI service
- ✅ `Server/appsettings.json` - Thêm config OpenAI
- ✅ `Server/appsettings.Development.json` - Thêm config OpenAI

### Documentation
- ✅ `Server/OPENAI_INTEGRATION_GUIDE.md` - Hướng dẫn chi tiết

## 💡 Cách hoạt động

1. **User gửi câu hỏi** → Frontend gửi tới `/api/Chat/send-message`
2. **ChatService xử lý**:
   - Phân tích câu hỏi để xác định nhu cầu
   - Truy vấn database lấy dữ liệu liên quan (phim, lịch chiếu, rạp, giá vé)
   - Xây dựng context data từ kết quả query
3. **OpenAI xử lý**:
   - Nhận context data + câu hỏi user
   - GPT-4o-mini phân tích và tạo câu trả lời tự nhiên
   - Trả về response thông minh
4. **Fallback**: Nếu OpenAI lỗi → sử dụng rule-based responses

## 💰 Chi phí

Với **GPT-4o-mini**:
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- **Ước tính**: ~$0.0004 per conversation (~$12/tháng cho 1000 chats/ngày)

## 🔒 Bảo mật

⚠️ **QUAN TRỌNG**: Không commit API Key lên Git!

Sử dụng Environment Variables cho production:
```bash
# Windows PowerShell
$env:OpenAI__ApiKey="sk-proj-xxxxx"

# Linux/Mac
export OpenAI__ApiKey="sk-proj-xxxxx"
```

## 📚 Tài liệu

Xem hướng dẫn chi tiết: [OPENAI_INTEGRATION_GUIDE.md](Server/OPENAI_INTEGRATION_GUIDE.md)

## 🐛 Troubleshooting

**Lỗi "OpenAI API Key not configured"**
→ Kiểm tra `appsettings.json` đã có config OpenAI chưa

**Lỗi 401 Unauthorized**
→ API Key không hợp lệ, kiểm tra lại key

**Lỗi 429 Too Many Requests**
→ Vượt quota, nâng cấp plan OpenAI

**Chatbot không trả lời**
→ Kiểm tra console logs, kiểm tra credit OpenAI

---

**Made with ❤️ by CineBook Team**
