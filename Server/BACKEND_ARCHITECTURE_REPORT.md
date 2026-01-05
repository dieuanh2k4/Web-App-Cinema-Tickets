# BÁO CÁO THIẾT KẾ KIẾN TRÚC BACKEND
## HỆ THỐNG ĐẶT VÉ XEM PHIM CINEBOOK

---

## 📋 MỤC LỤC
1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Kiến Trúc Tổng Thể](#3-kiến-trúc-tổng-thể)
4. [Cấu Trúc Dự Án](#4-cấu-trúc-dự-án)
5. [Database Design](#5-database-design)
6. [API Design](#6-api-design)
7. [Bảo Mật](#7-bảo-mật)
8. [Tối Ưu Hiệu Suất](#8-tối-ưu-hiệu-suất)
9. [DevOps & Deployment](#9-devops--deployment)
10. [Kết Luận](#10-kết-luận)

---

## 1. TỔNG QUAN HỆ THỐNG

### 1.1. Giới thiệu
Hệ thống backend CineBook là một RESTful API được xây dựng để phục vụ cho ứng dụng đặt vé xem phim trực tuyến. Hệ thống được thiết kế theo kiến trúc **N-Layer Architecture** (Layered Architecture) kết hợp với **Repository Pattern** và **Dependency Injection** để đảm bảo tính mở rộng, bảo trì và kiểm thử.

### 1.2. Mục tiêu thiết kế
- **Scalability**: Khả năng mở rộng theo chiều ngang (horizontal scaling)
- **Maintainability**: Dễ dàng bảo trì và nâng cấp
- **Security**: Bảo mật dữ liệu người dùng và giao dịch
- **Performance**: Tối ưu hiệu suất với caching và background jobs
- **Reliability**: Đảm bảo tính ổn định và xử lý lỗi hiệu quả

---

## 2. CÔNG NGHỆ SỬ DỤNG

### 2.1. Core Framework
- **ASP.NET Core 8.0** - Framework chính
- **C# .NET 8.0** - Ngôn ngữ lập trình
- **Entity Framework Core 8.0.11** - ORM

### 2.2. Database & Storage
- **PostgreSQL** - Cơ sở dữ liệu quan hệ chính (via Npgsql 8.0.10)
- **Redis** - In-memory cache và distributed lock (StackExchange.Redis 2.10.1)
- **MinIO** - Object storage cho media files (Minio 7.0.0)
- **Cloudinary** - Cloud storage cho ảnh (CloudinaryDotNet 1.27.7)

### 2.3. Authentication & Security
- **JWT Bearer Authentication** - Microsoft.AspNetCore.Authentication.JwtBearer 8.0.10
- **Role-Based Access Control (RBAC)** - Hệ thống phân quyền tùy chỉnh

### 2.4. Background Jobs & Scheduling
- **Hangfire** - Background job processing (Hangfire.AspNetCore 1.8.22)
- **Hangfire.PostgreSql** - Hangfire storage với PostgreSQL (1.20.13)

### 2.5. Distributed Systems
- **RedLock.net** - Distributed locking (2.3.2)
- **StackExchange.Redis** - Redis client (2.10.1)

### 2.6. Payment Integration
- **VNPay** - Cổng thanh toán điện tử

### 2.7. Utilities
- **QRCoder** - Tạo mã QR cho vé (1.6.0)
- **SixLabors.ImageSharp** - Xử lý ảnh (3.1.6)
- **Swashbuckle (Swagger)** - API documentation (6.6.2)

### 2.8. DevOps
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **Jenkins** - CI/CD pipeline

---

## 3. KIẾN TRÚC TỔNG THỂ

### 3.1. Kiến trúc N-Layer

Hệ thống được tổ chức theo mô hình 5 tầng:

```
┌─────────────────────────────────────────────────┐
│           PRESENTATION LAYER                    │
│              (Controllers)                      │
│  - MoviesController, BookingController          │
│  - AuthController, PaymentController...         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          BUSINESS LOGIC LAYER                   │
│              (Services)                         │
│  - MovieService, BookingService                 │
│  - AuthService, PaymentService...               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          DATA ACCESS LAYER                      │
│         (Repositories)                          │
│  - UserRepository, CustomerRepository           │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          DATA LAYER                             │
│    (Entity Framework + DbContext)               │
│         ApplicationDbContext                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          DATABASE                               │
│           PostgreSQL                            │
└─────────────────────────────────────────────────┘
```

### 3.2. Design Patterns

#### 3.2.1. Repository Pattern
- Tách biệt logic truy vấn database khỏi business logic
- Tạo abstraction layer cho data access
- Dễ dàng testing và mock data

```csharp
// Interface
public interface IUserRepository
{
    Task<User> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    // ...
}

// Implementation
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    // ...
}
```

#### 3.2.2. Dependency Injection
- Đăng ký services trong Program.cs
- Giảm coupling giữa các components
- Dễ dàng thay đổi implementation

```csharp
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IBookingService, BookingService>();
```

#### 3.2.3. Service Layer Pattern
- Tách biệt business logic khỏi controllers
- Reusable business logic
- Single Responsibility Principle

---

## 4. CẤU TRÚC DỰ ÁN

### 4.1. Sơ đồ thư mục

```
Server/
├── src/
│   ├── Controllers/          # API Controllers (20 controllers)
│   │   ├── AdminController.cs
│   │   ├── AuthController.cs
│   │   ├── BookingController.cs
│   │   ├── ChatController.cs
│   │   ├── CustomerController.cs
│   │   ├── DashboardController.cs
│   │   ├── MoviesController.cs
│   │   ├── PaymentController.cs
│   │   ├── RoomController.cs
│   │   ├── SearchController.cs
│   │   ├── SeatsController.cs
│   │   ├── ShowtimesController.cs
│   │   ├── StaffController.cs
│   │   ├── TheaterController.cs
│   │   ├── TicketController.cs
│   │   └── ...
│   │
│   ├── Services/             # Business Logic Layer
│   │   ├── Interfaces/       # Service interfaces
│   │   │   ├── IAuthService.cs
│   │   │   ├── IBookingService.cs
│   │   │   ├── IChatService.cs
│   │   │   ├── IMovieService.cs
│   │   │   └── ... (19 interfaces)
│   │   │
│   │   └── Implements/       # Service implementations
│   │       ├── AuthService.cs
│   │       ├── BookingService.cs
│   │       ├── ChatService.cs
│   │       └── ...
│   │
│   ├── Repositories/         # Data Access Layer
│   │   ├── Interfaces/
│   │   │   ├── IUserRepository.cs
│   │   │   └── ICustomerRepository.cs
│   │   │
│   │   └── Implements/
│   │       ├── UserRepository.cs
│   │       └── CustomerRepository.cs
│   │
│   ├── Models/               # Domain Entities (19 models)
│   │   ├── Admin.cs
│   │   ├── Customer.cs
│   │   ├── Movies.cs
│   │   ├── Payment.cs
│   │   ├── Roles.cs
│   │   ├── Rooms.cs
│   │   ├── Seats.cs
│   │   ├── Showtimes.cs
│   │   ├── Staff.cs
│   │   ├── Theater.cs
│   │   ├── Ticket.cs
│   │   ├── TicketSeat.cs
│   │   ├── User.cs
│   │   └── ...
│   │
│   ├── Dtos/                 # Data Transfer Objects
│   │   ├── Request/
│   │   └── Response/
│   │
│   ├── Data/                 # Database Context & Seeding
│   │   ├── ApplicationDbContext.cs
│   │   ├── DataSeeder.cs
│   │   └── RbacSeeder.cs
│   │
│   ├── BackgroundJobs/       # Hangfire Jobs
│   │   └── SeatHoldCleanupJob.cs
│   │
│   ├── Utils/                # Utilities
│   │   ├── JwtTokenHelper.cs
│   │   ├── EmailService.cs
│   │   ├── QRCodeService.cs
│   │   └── ...
│   │
│   ├── Mapper/               # Object mapping
│   ├── Exceptions/           # Custom exceptions
│   └── Constant/             # Constants & enums
│
├── Migrations/               # EF Core Migrations (36 files)
├── nginx/                    # Nginx configuration
├── Program.cs                # Application entry point
├── appsettings.json          # Configuration
├── Server.csproj             # Project file
├── Dockerfile                # Docker configuration
└── docker-compose.yml        # Docker Compose
```

### 4.2. Chi tiết các Layer

#### 4.2.1. Controllers Layer
- **Vai trò**: Xử lý HTTP requests/responses
- **Số lượng**: 20 controllers
- **Base Controller**: `ApiControllerBase` - chứa common logic
- **Chức năng chính**:
  - Validate input
  - Call business logic services
  - Format responses
  - Handle exceptions

**Các Controllers chính:**
- `AuthController`: Đăng nhập, đăng ký, quên mật khẩu
- `BookingController`: Quản lý đặt vé
- `MoviesController`: Quản lý phim
- `PaymentController`: Xử lý thanh toán
- `ShowtimesController`: Quản lý suất chiếu
- `SeatsController`: Quản lý ghế ngồi
- `ChatController`: AI Chatbot
- `DashboardController`: Thống kê báo cáo

#### 4.2.2. Services Layer
- **Vai trò**: Chứa business logic
- **Số lượng**: 19 services
- **Pattern**: Interface-based design
- **Dependency Injection**: Scoped lifetime

**Các Services chính:**
- `IAuthService`: Xác thực, phân quyền
- `IBookingService`: Logic đặt vé, hold ghế
- `IMovieService`: CRUD phim, tìm kiếm
- `IDistributedLockService`: Distributed locking với Redis
- `INotificationService`: Gửi thông báo
- `VNPayService`: Tích hợp thanh toán VNPay
- `EmailService`: Gửi email
- `QRCodeService`: Tạo QR code cho vé

#### 4.2.3. Repositories Layer
- **Vai trò**: Truy vấn database
- **Pattern**: Generic Repository
- **Repositories**:
  - `IUserRepository`
  - `ICustomerRepository`

#### 4.2.4. Models Layer
- **Vai trò**: Domain entities
- **Số lượng**: 19 models
- **ORM**: Entity Framework Core
- **Key Models**:
  - `User`, `Admin`, `Staff`, `Customer`
  - `Movies`, `Theater`, `Rooms`, `Seats`
  - `Showtimes`, `Ticket`, `TicketSeat`
  - `Payment`, `TicketPrice`
  - `Roles`, `Permission`, `UserRole`, `RolePermission`

---

## 5. DATABASE DESIGN

### 5.1. Database Management System
- **DBMS**: PostgreSQL
- **Version**: Compatible with Npgsql 8.0.5
- **Connection**: Cloud-hosted (Supabase)
- **Pooling**: Enabled (Min: 0, Max: 100)

### 5.2. Key Tables

#### 5.2.1. User Management
```sql
- User          # Bảng người dùng chính
- Admin         # Quản trị viên
- Staff         # Nhân viên
- Customer      # Khách hàng
- Roles         # Vai trò
- Permission    # Quyền hạn
- UserRole      # User-Role mapping
- RolePermission # Role-Permission mapping
```

#### 5.2.2. Cinema Management
```sql
- Movies        # Phim
- Theater       # Rạp chiếu
- Rooms         # Phòng chiếu
- Seats         # Ghế ngồi
- Showtimes     # Suất chiếu
- TicketPrice   # Bảng giá vé
```

#### 5.2.3. Booking & Payment
```sql
- Ticket        # Vé đặt
- TicketSeat    # Ghế trong vé
- StatusSeat    # Trạng thái ghế
- Payment       # Thanh toán
```

#### 5.2.4. Utilities
```sql
- OTPCode       # Mã OTP cho reset password
```

### 5.3. Database Features

#### 5.3.1. Migrations
- **Tự động**: Auto-migration khi startup
- **Số lượng**: 36 migration files
- **Versioning**: Theo timestamp

```csharp
// Program.cs - Auto Migration
using (var scope = app.Services.CreateScope())
{
    var context = services.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate(); // Tự động migrate
    DataSeeder.Seed(context);   // Seed dữ liệu mẫu
}
```

#### 5.3.2. Data Seeding
- **RbacSeeder**: Seed roles và permissions
- **DataSeeder**: Seed dữ liệu mẫu

#### 5.3.3. Constraints & Validations
```csharp
// Check constraint example
entity.ToTable(c => {
    c.HasCheckConstraint("CK_Customer_Gender", 
        "\"Gender\" IN('Nam', 'Nữ', 'Khác')");
});
```

#### 5.3.4. Relationships
- **One-to-Many**: Theater → Rooms → Seats
- **Many-to-Many**: User ↔ Roles (via UserRole)
- **One-to-One**: Customer ↔ User

---

## 6. API DESIGN

### 6.1. RESTful API Principles
- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: 200, 201, 400, 401, 403, 404, 500
- **Response Format**: JSON
- **Error Handling**: Consistent error responses

### 6.2. API Documentation
- **Tool**: Swagger/OpenAPI
- **Endpoint**: `/swagger`
- **Features**:
  - Interactive API testing
  - JWT authentication trong Swagger UI
  - Request/Response examples
  - Schema definitions

```csharp
// Swagger Configuration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cinema Ticket Booking API",
        Version = "v1",
        Description = "API quản lý đặt vé xem phim"
    });
    
    // JWT Authorization
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
});
```

### 6.3. API Categories

#### 6.3.1. Authentication APIs (`/api/auth`)
- `POST /register` - Đăng ký
- `POST /login` - Đăng nhập
- `POST /forgot-password` - Quên mật khẩu
- `POST /reset-password` - Đặt lại mật khẩu
- `POST /verify-otp` - Xác thực OTP

#### 6.3.2. Movie APIs (`/api/movies`)
- `GET /api/movies` - Danh sách phim
- `GET /api/movies/{id}` - Chi tiết phim
- `POST /api/movies` - Thêm phim (Admin)
- `PUT /api/movies/{id}` - Cập nhật phim (Admin)
- `DELETE /api/movies/{id}` - Xóa phim (Admin)

#### 6.3.3. Booking APIs (`/api/booking`)
- `POST /api/booking/hold-seats` - Hold ghế tạm thời
- `POST /api/booking/create` - Tạo booking
- `POST /api/booking/release-seats` - Giải phóng ghế
- `GET /api/booking/{id}` - Chi tiết booking

#### 6.3.4. Payment APIs (`/api/payment`)
- `POST /api/payment/vnpay/create` - Tạo thanh toán VNPay
- `GET /api/payment/vnpay/callback` - Callback VNPay
- `GET /api/payment/{id}` - Trạng thái thanh toán

#### 6.3.5. Showtime APIs (`/api/showtimes`)
- `GET /api/showtimes` - Danh sách suất chiếu
- `GET /api/showtimes/{id}` - Chi tiết suất chiếu
- `POST /api/showtimes` - Tạo suất chiếu (Admin)

#### 6.3.6. Admin APIs (`/api/admin`)
- `GET /api/admin/users` - Quản lý users
- `POST /api/admin/roles` - Quản lý roles
- `GET /api/admin/permissions` - Quản lý permissions

#### 6.3.7. Dashboard APIs (`/api/dashboard`)
- `GET /api/dashboard/statistics` - Thống kê tổng quan
- `GET /api/dashboard/revenue` - Doanh thu
- `GET /api/dashboard/top-movies` - Top phim

#### 6.3.8. Chat APIs (`/api/chat`)
- `POST /api/chat/message` - Gửi tin nhắn tới AI chatbot

### 6.4. CORS Configuration
```csharp
// Allow all origins, methods, headers
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

---

## 7. BẢO MẬT

### 7.1. JWT Authentication

#### 7.1.1. Cấu hình
```json
"Jwt": {
    "Key": "SuperSecretKey123456...",
    "Issuer": "http://{HOSTNAME}:5001",
    "Audience": "http://{HOSTNAME}:5001"
}
```

#### 7.1.2. Token Generation
- **Algorithm**: HS256
- **Claims**: UserId, Email, Roles
- **Expiration**: Configurable
- **Refresh Token**: Supported

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(...)
        };
    });
```

### 7.2. Role-Based Access Control (RBAC)

#### 7.2.1. Cấu trúc RBAC
```
User ──┐
       ├──> UserRole ──> Role ──> RolePermission ──> Permission
       │
Customer/Admin/Staff
```

#### 7.2.2. Roles
- **Admin**: Quản trị hệ thống
- **Staff**: Nhân viên rạp
- **Customer**: Khách hàng

#### 7.2.3. Permissions
- Quản lý chi tiết quyền hạn cho từng chức năng
- Linh hoạt gán/thu hồi quyền

### 7.3. Data Protection

#### 7.3.1. Password Hashing
- **Algorithm**: BCrypt/PBKDF2
- **Salt**: Auto-generated

#### 7.3.2. HTTPS
- Trong production: Nginx reverse proxy xử lý SSL/TLS
- Certificate management

#### 7.3.3. Input Validation
- Data Annotations trong DTOs
- Model validation trong controllers
- SQL Injection prevention (EF Core parameterized queries)

#### 7.3.4. Sensitive Data
- Không log sensitive data
- Environment variables cho secrets
- `.env` files (không commit vào git)

---

## 8. TỐI ƯU HIỆU SUẤT

### 8.1. Redis Caching

#### 8.1.1. Cấu hình
```json
"Redis": {
    "ConnectionString": "redis:6379",
    "InstanceName": "CineBook_",
    "AbortOnConnectFail": false,
    "SeatHoldTTLMinutes": 10
}
```

#### 8.1.2. Use Cases
- **Seat Hold**: Giữ ghế tạm thời (TTL: 10 phút)
- **Session Management**: Cache user sessions
- **Distributed Cache**: Shared cache giữa các instances

```csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = builder.Configuration["Redis:InstanceName"];
});
```

### 8.2. Distributed Locking

#### 8.2.1. RedLock Implementation
- **Library**: RedLock.net
- **Purpose**: Đảm bảo tính nhất quán khi book ghế
- **Mechanism**: Distributed lock trên Redis

```csharp
builder.Services.AddScoped<IDistributedLockService, DistributedLockService>();
```

#### 8.2.2. Seat Booking Flow
```
1. User chọn ghế
2. Acquire distributed lock
3. Check ghế available
4. Hold ghế (Redis TTL: 10 mins)
5. Release lock
6. User thanh toán trong 10 phút
7. Confirm booking hoặc auto-release
```

### 8.3. Background Jobs (Hangfire)

#### 8.3.1. Cấu hình
```csharp
builder.Services.AddHangfire(config => config
    .UsePostgreSqlStorage(options => {
        options.UseNpgsqlConnection(connectionString);
    }));

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 1;
});
```

#### 8.3.2. Recurring Jobs
- **SeatHoldCleanupJob**: Tự động giải phóng ghế hết hạn
- **Schedule**: Mỗi 1 phút
- **Timezone**: SE Asia Standard Time (GMT+7)

```csharp
RecurringJob.AddOrUpdate<SeatHoldCleanupJob>(
    "check-expiring-seat-holds",
    job => job.CheckExpiringSeatHolds(),
    "*/1 * * * *", // Cron: mỗi 1 phút
    new RecurringJobOptions {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time")
    }
);
```

#### 8.3.3. Hangfire Dashboard
- **URL**: `/hangfire`
- **Features**: Monitor jobs, retry failed jobs
- **Authorization**: Custom filter

### 8.4. Database Optimization

#### 8.4.1. Connection Pooling
```
Pooling=true
Minimum Pool Size=0
Maximum Pool Size=100
```

#### 8.4.2. Retry Logic
```csharp
options.UseNpgsql(connectionString, npgsqlOptions => 
    npgsqlOptions.EnableRetryOnFailure(
        maxRetryCount: 3,
        maxRetryDelay: TimeSpan.FromSeconds(10),
        errorCodesToAdd: null
    )
);
```

#### 8.4.3. Indexes
- Primary keys tự động indexed
- Foreign keys indexed
- Query optimization với EF Core

### 8.5. JSON Serialization
```csharp
// Tránh lỗi circular reference
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = 
            ReferenceHandler.IgnoreCycles;
    });
```

---

## 9. DEVOPS & DEPLOYMENT

### 9.1. Containerization (Docker)

#### 9.1.1. Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
# Build process...
```

#### 9.1.2. Docker Compose
**Services**:
- `server` (ASP.NET Core API)
- `postgres` (Database)
- `redis` (Cache)
- `minio` (Object storage)
- `nginx` (Reverse proxy)

```yaml
version: '3.8'
services:
  server:
    build: .
    ports:
      - "5001:8080"
    depends_on:
      - postgres
      - redis
      - minio
```

### 9.2. Reverse Proxy (Nginx)

#### 9.2.1. Chức năng
- **Load balancing**
- **SSL/TLS termination**
- **Static file serving**
- **Gzip compression**

#### 9.2.2. Configuration
```nginx
# nginx/nginx.conf
location /api {
    proxy_pass http://server:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 9.3. CI/CD (Jenkins)

#### 9.3.1. Jenkinsfile
- **Stages**: Build, Test, Deploy
- **Automation**: Auto deployment on commit
- **Notifications**: Build status

### 9.4. Environment Configuration

#### 9.4.1. Configuration Files
- `appsettings.json` - Default settings
- `appsettings.Development.json` - Dev overrides
- `.env` - Secrets (not in git)
- `.env.production` - Production secrets

#### 9.4.2. Hostname Replacement
```csharp
// Tự động thay thế {HOSTNAME} trong config
var hostname = Environment.GetEnvironmentVariable("HOSTNAME") 
    ?? Environment.MachineName;
// Replace {HOSTNAME} in all configuration values
```

### 9.5. Health Checks

```csharp
app.MapHealthChecks("/health");

builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("postgresql")
    .AddCheck("redis", () => { /* check Redis */ });
```

**Endpoint**: `GET /health`
**Response**:
```json
{
  "status": "Healthy",
  "checks": {
    "postgresql": "Healthy",
    "redis": "Healthy"
  }
}
```

---

## 10. KẾT LUẬN

### 10.1. Điểm Mạnh

#### 10.1.1. Kiến trúc
✅ **Clean Architecture**: Tách biệt rõ ràng các layers  
✅ **Scalable**: Dễ dàng scale horizontal với Docker  
✅ **Maintainable**: Code structure rõ ràng, dễ bảo trì  
✅ **Testable**: Dependency Injection, Repository Pattern  

#### 10.1.2. Công nghệ
✅ **Modern Stack**: .NET 8, PostgreSQL, Redis  
✅ **Cloud-Ready**: Docker, Microservices-ready  
✅ **Performance**: Caching, Background Jobs, Connection Pooling  

#### 10.1.3. Bảo mật
✅ **JWT Authentication**: Secure token-based auth  
✅ **RBAC**: Fine-grained access control  
✅ **HTTPS**: SSL/TLS via Nginx  

#### 10.1.4. DevOps
✅ **CI/CD**: Jenkins automation  
✅ **Containerization**: Docker Compose  
✅ **Monitoring**: Hangfire Dashboard, Health Checks  

### 10.2. Các tính năng nổi bật

#### 10.2.1. Real-time Seat Booking
- Distributed locking với RedLock
- Redis TTL cho seat hold
- Background job cleanup

#### 10.2.2. Payment Integration
- VNPay integration
- QR Code generation
- Email notifications

#### 10.2.3. AI Chatbot
- ChatService integration
- Customer support automation

#### 10.2.4. Admin Dashboard
- Revenue statistics
- Movie analytics
- User management

### 10.3. Khả năng mở rộng

#### 10.3.1. Horizontal Scaling
- Stateless API design
- Redis distributed cache
- Load balancing với Nginx

#### 10.3.2. Microservices Migration
- Services đã tách biệt rõ ràng
- Có thể tách thành các microservices:
  - Auth Service
  - Booking Service
  - Payment Service
  - Movie Service

#### 10.3.3. Message Queue
- Có thể tích hợp RabbitMQ/Kafka
- Event-driven architecture

### 10.4. Best Practices được áp dụng

1. **Separation of Concerns**: Controllers, Services, Repositories
2. **Dependency Injection**: Loose coupling
3. **Repository Pattern**: Data access abstraction
4. **DTOs**: Data transfer optimization
5. **Exception Handling**: Centralized error handling
6. **Logging**: Structured logging
7. **Configuration Management**: Environment-based config
8. **Database Migrations**: Version control cho database schema
9. **API Documentation**: Swagger/OpenAPI
10. **Security**: JWT, RBAC, HTTPS

---

## 📊 THỐNG KÊ DỰ ÁN

| Thành phần | Số lượng |
|-----------|----------|
| Controllers | 20 |
| Services | 19 |
| Repositories | 2 |
| Models | 19 |
| Migrations | 36 |
| Background Jobs | 1 |
| External Services | 5 (PostgreSQL, Redis, MinIO, VNPay, Email) |

---

## 📚 TÀI LIỆU THAM KHẢO

1. **Microsoft Documentation**
   - ASP.NET Core: https://docs.microsoft.com/aspnet/core
   - Entity Framework Core: https://docs.microsoft.com/ef/core

2. **Third-party Libraries**
   - Hangfire: https://www.hangfire.io
   - Redis: https://redis.io
   - MinIO: https://min.io

3. **Project Documentation**
   - [AI_SHOWTIME_SYSTEM.md](AI_SHOWTIME_SYSTEM.md)
   - [BOOKING_TEST_GUIDE.md](BOOKING_TEST_GUIDE.md)
   - [CHATBOT_AI_SETUP.md](CHATBOT_AI_SETUP.md)
   - [REDIS_SETUP.md](REDIS_SETUP.md)

---

**Ngày tạo**: 05/01/2026  
**Phiên bản**: 1.0  
**Tác giả**: CineBook Development Team
