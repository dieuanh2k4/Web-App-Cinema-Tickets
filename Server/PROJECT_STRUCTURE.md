# CineBook Cinema Ticket Booking API - Project Structure

**Generated Date:** January 6, 2026  
**Framework:** ASP.NET Core 8.0  
**Database:** PostgreSQL (Supabase)  
**Cache:** Redis  
**Storage:** Minio (S3-compatible)  
**Background Jobs:** Hangfire

---

## 📁 Directory Structure

```
Server/
├── src/
│   ├── BackgroundJobs/
│   │   └── SeatHoldCleanupJob.cs          # Recurring job cleanup ghế hold hết hạn (1 phút)
│   │
│   ├── Constant/
│   │   └── UserTypes.cs                   # Constant định nghĩa loại user (Admin, Staff, Customer)
│   │
│   ├── Controllers/                       # API Controllers (REST endpoints)
│   │   ├── ApiControllerBase.cs           # Base controller với error handling
│   │   ├── AuthController.cs              # Login, Register, Forgot Password
│   │   ├── BookingController.cs           # Guest booking (hold-seats, confirm-booking)
│   │   ├── ChatController.cs              # Chatbot AI (pattern matching)
│   │   ├── CustomerController.cs          # CRUD Customer
│   │   ├── DashboardController.cs         # Thống kê doanh thu, top phim
│   │   ├── MoviesController.cs            # CRUD Movies (upload ảnh Cloudinary)
│   │   ├── PaymentController.cs           # Mock payment với QR code
│   │   ├── RedisTestController.cs         # Test Redis connection
│   │   ├── RoomController.cs              # CRUD Rooms & Seats
│   │   ├── SearchController.cs            # Search phim, rạp
│   │   ├── SeatsController.cs             # Get seats by room
│   │   ├── ShowtimesController.cs         # CRUD Showtimes
│   │   ├── StaffBookingController.cs      # Staff booking (hold + confirm)
│   │   ├── TheaterController.cs           # CRUD Theaters
│   │   ├── TicketController.cs            # Get tickets by user
│   │   ├── TicketController_New.cs        # Ticket management v2
│   │   ├── TicketPricesController.cs      # CRUD Ticket Prices
│   │   └── UserController.cs              # CRUD Users, Roles, Permissions
│   │
│   ├── Data/
│   │   ├── ApplicationDbContext.cs        # EF Core DbContext
│   │   ├── DataSeeder.cs                  # Seed data mẫu (phim, rạp, user)
│   │   └── RbacSeeder.cs                  # Seed RBAC (Roles, Permissions)
│   │
│   ├── Dtos/                              # Data Transfer Objects
│   │   ├── Auth/
│   │   │   ├── AuthResult.cs
│   │   │   ├── ForgotPasswordDtos.cs
│   │   │   ├── LoginRequestDto.cs
│   │   │   ├── LoginResponseDto.cs
│   │   │   └── RegisterDto.cs
│   │   ├── Booking/
│   │   │   ├── BookingResponseDto.cs
│   │   │   ├── CreateBookingDto.cs
│   │   │   └── StaffBookingDto.cs
│   │   ├── Customers/
│   │   │   ├── CreateCustomerDto.cs
│   │   │   ├── CustomerDto.cs
│   │   │   └── UpdateCustomerDto.cs
│   │   ├── Dashboard/
│   │   │   ├── DashboardStatisticsDto.cs
│   │   │   ├── RevenueByMonthDto.cs
│   │   │   └── TopMovieDto.cs
│   │   ├── Exceptions/
│   │   │   └── ExceptionBody.cs
│   │   ├── Movies/
│   │   │   ├── CreateMovieDto.cs
│   │   │   ├── MovieDto.cs
│   │   │   └── UpdateMovieDto.cs
│   │   ├── Payment/
│   │   ├── Rooms/
│   │   │   ├── CreateRoomDto.cs
│   │   │   ├── CreateSeatDto.cs
│   │   │   ├── RoomDto.cs
│   │   │   └── UpdateRoomDto.cs
│   │   ├── Seats/
│   │   │   ├── SeatAvailabilityDto.cs
│   │   │   └── UpdateSeatLayoutDto.cs
│   │   ├── ShowTimes/
│   │   │   ├── CreateShowtimeDto.cs
│   │   │   ├── ShowtimeDetailDto.cs
│   │   │   ├── ShowtimeDto.cs
│   │   │   └── UpdateShowtimeDto.cs
│   │   ├── Theater/
│   │   │   ├── CreateTheaterDto.cs
│   │   │   ├── TheaterDto.cs
│   │   │   └── UpdateTheaterDto.cs
│   │   ├── TicketPrices/
│   │   ├── Tickets/
│   │   ├── Users/
│   │   └── VNPay/
│   │
│   ├── Exceptions/
│   │   └── Result.cs                      # Custom exception cho business logic
│   │
│   ├── Mapper/                            # Entity <-> DTO mappers
│   │   ├── MoviesMapper.cs
│   │   ├── RegisterMapper.cs
│   │   ├── RoomMapper.cs
│   │   ├── ShowtimeMapper.cs
│   │   ├── ShowtimesMapper.cs
│   │   ├── TheaterMapper.cs
│   │   ├── TicketMapper.cs
│   │   ├── TicketPriceMapper.cs
│   │   └── UserMapper.cs
│   │
│   ├── Models/                            # Database entities
│   │   ├── Customer.cs
│   │   ├── Movies.cs
│   │   ├── OTPCode.cs                     # OTP cho forgot password
│   │   ├── Payment.cs
│   │   ├── Permission.cs                  # RBAC: Permissions
│   │   ├── RolePermission.cs              # RBAC: Role-Permission mapping
│   │   ├── Roles.cs                       # RBAC: Roles (Admin, Staff, Customer)
│   │   ├── Rooms.cs
│   │   ├── Seats.cs
│   │   ├── Showtimes.cs
│   │   ├── StatusSeat.cs                  # Trạng thái ghế (Available, Pending, Booked)
│   │   ├── Theater.cs
│   │   ├── Ticket.cs
│   │   ├── TicketPrice.cs
│   │   ├── TicketSeat.cs                  # Many-to-many: Ticket <-> Seat
│   │   ├── User.cs
│   │   └── UserRole.cs                    # Many-to-many: User <-> Role
│   │
│   ├── Repositories/
│   │   ├── Implements/
│   │   │   ├── CustomerRepository.cs
│   │   │   └── UserRepository.cs
│   │   └── Interfaces/
│   │       ├── ICustomerRepository.cs
│   │       └── IUserRepository.cs
│   │
│   ├── Services/                          # Business logic services
│   │   ├── Implements/
│   │   │   ├── AuthService.cs             # Login, Register, JWT token
│   │   │   ├── BookingService.cs          # Guest & Staff booking logic
│   │   │   ├── ChatService.cs             # Pattern matching chatbot
│   │   │   ├── CustomerService.cs
│   │   │   ├── DashboardService.cs        # Thống kê doanh thu
│   │   │   ├── DistributedLockService.cs  # RedLock cho seat locking
│   │   │   ├── EmailService.cs            # Send email (SMTP)
│   │   │   ├── MinioStorageService.cs     # Upload file lên Minio
│   │   │   ├── MovieService.cs
│   │   │   ├── NotificationService.cs     # Send notifications
│   │   │   ├── QRCodeService.cs           # Generate QR code
│   │   │   ├── RoomService.cs
│   │   │   ├── ShowtimeService.cs
│   │   │   ├── TheaterService.cs
│   │   │   ├── TicketPriceService.cs
│   │   │   ├── TicketService.cs
│   │   │   ├── UserService.cs
│   │   │   └── VNPayService.cs            # VNPay integration (disabled)
│   │   └── Interfaces/
│   │       ├── IAuthService.cs
│   │       ├── IBookingService.cs
│   │       ├── IChatService.cs
│   │       ├── ICustomerService.cs
│   │       ├── IDashboardService.cs
│   │       ├── IDistributedLockService.cs
│   │       ├── IMinioStorageService.cs
│   │       ├── IMovieService.cs
│   │       ├── INotificationService.cs
│   │       ├── IRoomService.cs
│   │       ├── IShowtimeService.cs
│   │       ├── ITheaterService.cs
│   │       ├── ITicketPriceService.cs
│   │       ├── ITicketService.cs
│   │       └── IUserService.cs
│   │
│   └── Utils/                             # Utility classes
│       ├── CloudinarySettings.cs          # Cloudinary config model
│       ├── HangfireDashboardAuthorizationFilter.cs
│       ├── JwtTokenHelper.cs              # Generate & validate JWT
│       ├── PageResult.cs                  # Pagination helper
│       └── PasswordHelper.cs              # Hash & verify password (BCrypt)
│
├── Migrations/                            # EF Core migrations
├── Program.cs                             # Application entry point
├── appsettings.json                       # Configuration file
├── appsettings.Development.json
├── Server.csproj                          # Project dependencies
├── Dockerfile                             # Docker image definition
└── docker-compose.yml                     # Multi-container setup

```

---

## 📄 Program.cs

### Overview

Entry point của ứng dụng ASP.NET Core. Cấu hình services, middleware, và dependency injection.

### Key Features

#### 1. **Hostname Placeholder Replacement**

```csharp
var hostname = Environment.GetEnvironmentVariable("HOSTNAME") ?? Environment.MachineName;
// Thay thế {HOSTNAME} trong config với hostname thật
```

- Hỗ trợ deploy multi-environment
- Tự động replace `{HOSTNAME}` trong Jwt:Issuer, Minio:PublicEndpoint, etc.

#### 2. **Kestrel Configuration**

```csharp
options.ListenAnyIP(8080); // HTTP only
```

- Container chạy port 8080
- Nginx reverse proxy xử lý HTTPS
- Map ra host: `localhost:5000`

#### 3. **Database (PostgreSQL)**

```csharp
options.UseNpgsql(connectionString, npgsqlOptions =>
    npgsqlOptions.EnableRetryOnFailure(
        maxRetryCount: 3,
        maxRetryDelay: TimeSpan.FromSeconds(10)
    )
);
```

- Connection string: Supabase PostgreSQL
- Auto-retry khi connection failed
- UTC timestamp enabled

#### 4. **Redis Configuration**

```csharp
builder.Services.AddSingleton<IConnectionMultiplexer>(sp => {
    var configOptions = ConfigurationOptions.Parse(redisConfig["ConnectionString"]!);
    configOptions.AbortOnConnectFail = false; // Không crash khi Redis down
    return ConnectionMultiplexer.Connect(configOptions);
});
```

- Distributed cache
- Seat hold với TTL 10 phút
- Instance name: `CineBook_`

#### 5. **Hangfire (Background Jobs)**

```csharp
builder.Services.AddHangfire(config => config
    .UsePostgreSqlStorage(connectionString)
);
```

- Dashboard: `/hangfire`
- Recurring job: Cleanup seat holds mỗi 1 phút
- Timezone: GMT+7 (SE Asia Standard Time)

#### 6. **JWT Authentication**

```csharp
options.TokenValidationParameters = new TokenValidationParameters
{
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = jwtSettings["Issuer"],
    ValidAudience = jwtSettings["Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
};
```

#### 7. **Swagger with JWT**

```csharp
options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
{
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT",
    In = ParameterLocation.Header
});
```

- Auto-generate API docs
- JWT authorization UI
- Available: `/swagger`

#### 8. **CORS Policy**

```csharp
policy.AllowAnyOrigin()
      .AllowAnyMethod()
      .AllowAnyHeader();
```

- Cho phép mọi origin (dev mode)
- Production: nên restrict origins

#### 9. **Dependency Injection**

```csharp
// Services
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBookingService, BookingService>();
// ... 20+ services

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// Singleton services
builder.Services.AddSingleton<IConnectionMultiplexer>(...);
builder.Services.AddSingleton<IMinioClient>(...);
builder.Services.AddSingleton<JwtTokenHelper>();
```

#### 10. **Auto Migrations**

```csharp
using (var scope = app.Services.CreateScope())
{
    var context = services.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate(); // Chạy migrations tự động
    DataSeeder.Seed(context);   // Seed data mẫu
}
```

#### 11. **Middleware Pipeline**

```
Request
  ↓
Swagger UI
  ↓
CORS
  ↓
HTTPS Redirection
  ↓
Authentication (JWT)
  ↓
Authorization
  ↓
Controllers (Routing)
  ↓
Response
```

#### 12. **Health Checks**

```
GET /health
```

- Check PostgreSQL connection
- Check Redis connection
- Return: Healthy/Unhealthy status

---

## ⚙️ appsettings.json

### Configuration Sections

#### 1. **Cloudinary (Image Storage)**

```json
{
  "CloudinarySettings": {
    "CloudName": "dxxzcxazw",
    "ApiKey": "688473328276875",
    "ApiSecret": "yhj1vg3mD5q1Y6RkbasfE2BbWGo"
  }
}
```

- Upload movie posters
- CDN delivery
- Service: cloudinary.com

#### 2. **Logging**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

- Console logging
- Production: log vào file/monitoring service

#### 3. **JWT Authentication**

```json
{
  "Jwt": {
    "Key": "SuperSecretKey123456...",
    "Issuer": "http://{HOSTNAME}:5001",
    "Audience": "http://{HOSTNAME}:5001"
  }
}
```

- `{HOSTNAME}` auto-replaced khi startup
- Key: 64+ characters (HS256)
- Token expiry: 7 days (defined in JwtTokenHelper)

#### 4. **Database Connection**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "User Id=postgres.ifkogvgcnhiaxbvdieeg;Password=CineBook-123456;Server=aws-1-ap-southeast-1.pooler.supabase.com;Port=6543;Database=postgres;Timeout=60;..."
  }
}
```

- Provider: Supabase (PostgreSQL)
- Connection pooling: Min=0, Max=100
- Region: AWS Singapore (ap-southeast-1)

#### 5. **Minio (S3-compatible Storage)**

```json
{
  "Minio": {
    "Endpoint": "minio:9000",
    "PublicEndpoint": "{HOSTNAME}:9004",
    "PublicPort": "9004",
    "AccessKey": "minioadmin",
    "SecretKey": "minioadmin123",
    "UseSsl": false,
    "BucketName": "cinebook"
  }
}
```

- Container endpoint: `minio:9000` (internal)
- Public endpoint: `localhost:9004` (external access)
- Không dùng SSL trong dev
- Production: enable SSL

#### 6. **VNPay (Payment Gateway) - DISABLED**

```json
{
  "VNPay": {
    "TmnCode": "YOUR_VNPAY_TMN_CODE",
    "HashSecret": "YOUR_VNPAY_HASH_SECRET",
    "Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    "ReturnUrl": "http://{HOSTNAME}:5001/api/payment/vnpay/callback"
  }
}
```

- Tạm thời skip (dùng mock payment)
- Sandbox URL cho test
- Callback để receive payment result

#### 7. **Frontend URL**

```json
{
  "Frontend": {
    "Url": "http://{HOSTNAME}:3001"
  }
}
```

- React app URL
- Dùng cho CORS, redirects

#### 8. **Email (SMTP)**

```json
{
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@cinebook.com",
    "FromName": "CineBook Cinema"
  }
}
```

- Send booking confirmations
- Send OTP cho forgot password
- Gmail SMTP (cần enable App Password)

#### 9. **Redis (Cache & Distributed Lock)**

```json
{
  "Redis": {
    "ConnectionString": "redis:6379",
    "InstanceName": "CineBook_",
    "AbortOnConnectFail": false,
    "SeatHoldTTLMinutes": 10
  }
}
```

- Container endpoint: `redis:6379`
- Key prefix: `CineBook_`
- Seat hold expires sau 10 phút
- Không crash nếu Redis down

#### 10. **Groq AI (Experimental - Unused)**

```json
{
  "Groq": {
    "ApiKey": "your-groq-api-key-here",
    "BaseUrl": "https://api.groq.com/openai/v1"
  }
}
```

- Alternative AI API
- Hiện tại chưa dùng
- ChatService dùng pattern matching

---

## 🔐 Security Features

1. **JWT Bearer Authentication**

   - Token-based auth
   - Role-based authorization (Admin, Staff, Customer)
   - 7-day expiration

2. **Password Hashing**

   - BCrypt algorithm
   - Salt rounds: 12

3. **RBAC (Role-Based Access Control)**

   - Fine-grained permissions
   - Role-Permission mapping
   - Seeded via RbacSeeder

4. **SQL Injection Protection**

   - EF Core parameterized queries
   - LINQ queries

5. **CORS Policy**
   - Dev: Allow all origins
   - Production: Restrict to known domains

---

## 📊 Database Schema

### Core Tables

- **Users** → UserRole → **Roles** → RolePermission → **Permissions**
- **Movies** → **Showtimes** → StatusSeat → **Seats** ← **Rooms** ← **Theater**
- **Customer** → **Ticket** → TicketSeat → **Seats**
- **Ticket** → **Payment**
- **User** → **OTPCode** (forgot password)

### Key Relationships

- User : Role (Many-to-Many)
- Role : Permission (Many-to-Many)
- Ticket : Seat (Many-to-Many via TicketSeat)
- Showtime : Seat (Many-to-Many via StatusSeat)

---

## 🚀 Deployment

### Docker Compose Services

```yaml
services:
  backend:
    image: server-backend
    ports: ["5000:8080"]

  postgres:
    image: postgres:15

  redis:
    image: redis:7-alpine

  minio:
    image: minio/minio
    ports: ["9000:9000", "9004:9000"]
```

### Build & Run

```bash
cd Server
docker-compose build backend
docker-compose up -d
```

### Access Points

- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **Hangfire Dashboard**: http://localhost:5000/hangfire
- **Health Check**: http://localhost:5000/health
- **Minio Console**: http://localhost:9001

---

## 📦 NuGet Packages

### Core Packages

- `Microsoft.EntityFrameworkCore` (8.0.11)
- `Npgsql.EntityFrameworkCore.PostgreSQL` (8.0.10)
- `Microsoft.AspNetCore.Authentication.JwtBearer` (8.0.10)
- `Swashbuckle.AspNetCore` (6.6.2)

### Storage & Cache

- `StackExchange.Redis` (2.10.1)
- `Microsoft.Extensions.Caching.StackExchangeRedis` (8.0.4)
- `Minio` (7.0.0)
- `CloudinaryDotNet` (1.27.7)

### Background Jobs

- `Hangfire.AspNetCore` (1.8.22)
- `Hangfire.PostgreSql` (1.20.13)

### Utilities

- `QRCoder` (1.6.0) - QR code generation
- `RedLock.net` (2.3.2) - Distributed locking
- `SixLabors.ImageSharp` (3.1.6) - Image processing

---

## 🎯 Current Status

### ✅ Implemented Features

- User authentication (Login, Register, Forgot Password)
- Movie management (CRUD + Cloudinary upload)
- Theater & Room management
- Showtime scheduling
- Seat availability tracking (Redis + PostgreSQL)
- Booking workflow:
  - Guest booking: hold → create payment → confirm payment → confirm booking
  - Staff booking: hold → customer pays → confirm booking
- Mock payment with QR code
- Pattern-matching chatbot (ChatService)
- Dashboard statistics (revenue, top movies)
- RBAC (Roles, Permissions)
- Background job: Seat hold cleanup

### ⏳ In Progress

- Gemini AI chatbot integration (discussing RAG vs Function Calling)

### 🚫 Disabled Features

- VNPay payment gateway (using mock payment instead)

---

## 📝 Notes for AI Chatbot Development

### Current Chatbot (ChatService.cs)

- **Type**: Pattern matching (keyword-based)
- **Responses**: 10 predefined categories
- **Data Source**: Hard-coded + Database queries
- **Pros**: Fast, free, predictable
- **Cons**: Limited flexibility, requires manual updates

### Proposed AI Chatbot Options

#### Option 1: RAG (Retrieval-Augmented Generation) ⭐

1. User asks question
2. Backend searches database for relevant data
3. Build context from DB results
4. Send context + question to Gemini
5. Gemini generates natural answer

**Use case**: "Phim Avatar giá vé bao nhiêu?"

- Query DB: Movie "Avatar" + TicketPrices
- Context: `{title: "Avatar", prices: {VIP: 100k, Regular: 70k}}`
- Gemini response: "Phim Avatar có 2 loại vé: VIP 100.000đ và Thường 70.000đ"

#### Option 2: Function Calling (Gemini 1.5+) 🔥

1. Define functions: `getMovies()`, `getTheaters()`, `getTicketPrices()`
2. User asks → Gemini decides which function to call
3. Backend executes function → Returns data
4. Gemini uses data to answer naturally

**Advantage**: Gemini auto-detects user intent

#### Option 3: Hybrid (Pattern + Gemini) 💡

- Fast answers for common questions (pattern matching)
- Complex questions fallback to Gemini
- Cost-effective

### Required for AI Chatbot

- [ ] Add Gemini API package
- [ ] Implement intent detection OR function definitions
- [ ] Create DB query builders for each entity type
- [ ] Prompt engineering for natural responses
- [ ] Error handling for API failures
- [ ] Rate limiting to prevent abuse

---

**End of Documentation**
