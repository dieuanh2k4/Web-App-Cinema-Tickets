# 🚀 Setup Redis cho CineBook Backend

## 📋 Yêu cầu
- Docker Desktop đã cài đặt
- .NET 8 SDK

## ⚡ Quick Start (Dễ nhất)

### 1. Clone project và chạy Redis:
```bash
cd Server
docker-compose up -d
```

### 2. Verify Redis đã chạy:
```bash
docker ps
# Phải thấy: redis-cinebook (Up)

docker exec -it redis-cinebook redis-cli ping
# Response: PONG
```

### 3. Chạy API:
```bash
dotnet restore
dotnet build
dotnet run
```

### 4. Test Redis:
- Mở Swagger: https://localhost:7051/swagger
- Test endpoint: `GET /api/RedisTest/ping`
- Hoặc browser: http://localhost:5051/api/RedisTest/ping

### 5. Redis Web UI (Optional):
- Mở: http://localhost:8081
- Xem tất cả keys và data trong Redis

## 🔧 Commands hữu ích

```bash
# Xem logs Redis
docker logs redis-cinebook

# Stop Redis
docker-compose down

# Stop và xóa data
docker-compose down -v

# Restart Redis
docker-compose restart redis
```

## 📦 Các package đã cài

- **StackExchange.Redis** (v2.10.1) - Redis client
- **Microsoft.Extensions.Caching.StackExchangeRedis** (v10.0.1) - Distributed caching

## ⚙️ Configuration

**appsettings.json:**
```json
{
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "CineBook:",
    "SeatHoldTTLMinutes": 10,
    "AbortOnConnectFail": false
  }
}
```

## 🧪 Test Endpoints

### 1. Ping Redis
```bash
GET /api/RedisTest/ping
```

### 2. Hold ghế (giữ 10 phút)
```bash
POST /api/RedisTest/hold-seat
{
  "showtimeId": 1,
  "seatId": 45,
  "sessionId": "user-123"
}
```

### 3. Check ghế
```bash
GET /api/RedisTest/check-seat/{showtimeId}/{seatId}
```

### 4. Release ghế
```bash
DELETE /api/RedisTest/release-seat/{showtimeId}/{seatId}?sessionId=user-123
```

### 5. Xem tất cả ghế đang hold
```bash
GET /api/RedisTest/held-seats/{showtimeId}
```

## ❓ Troubleshooting

### Lỗi: "Cannot connect to Redis"
```bash
# Check Redis container
docker ps -a

# Nếu stopped, start lại
docker start redis-cinebook

# Hoặc chạy lại docker-compose
docker-compose up -d
```

### Lỗi: "Port 6379 already in use"
```bash
# Kiểm tra process đang dùng port
netstat -ano | findstr :6379

# Kill process hoặc đổi port trong docker-compose.yml
ports:
  - "6380:6379"  # Dùng port 6380 thay vì 6379
```

## 📚 Tài liệu

- [Redis Documentation](https://redis.io/docs/)
- [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/)
- [Docker Compose](https://docs.docker.com/compose/)

---

**🎯 Mục đích:** Redis được sử dụng để giữ ghế tạm thời (10 phút) khi khách hàng đang đặt vé, tránh race condition khi nhiều người cùng đặt 1 ghế.
