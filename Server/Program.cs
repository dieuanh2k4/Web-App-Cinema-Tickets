using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Server.src.Data;
using Server.src.Services.Implements;
using Server.src.Services.Interfaces;
using Server.src.Repositories.Implements;
using Server.src.Repositories.Interfaces;
using Server.src.Utils;
using Server.src.BackgroundJobs;
using StackExchange.Redis;
using Hangfire;
using Hangfire.PostgreSql;
using Minio;
using System.Net.Http.Headers;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ==========================
// Lấy hostname của máy và thay thế placeholder {HOSTNAME} trong config
// ==========================
var hostname = Environment.GetEnvironmentVariable("HOSTNAME") ?? Environment.MachineName;

// Thay thế {HOSTNAME} trong tất cả config
var config = builder.Configuration as IConfigurationRoot;
if (config != null)
{
    foreach (var provider in config.Providers)
    {
        if (provider is Microsoft.Extensions.Configuration.Json.JsonConfigurationProvider jsonProvider)
        {
            var data = new Dictionary<string, string?>();
            foreach (var key in jsonProvider.GetChildKeys(new List<string>(), null))
            {
                if (jsonProvider.TryGet(key, out var value) && value != null)
                {
                    data[key] = value.Replace("{HOSTNAME}", hostname);
                }
            }
            // Rebuild config với hostname thay thế
            foreach (var kvp in data)
            {
                jsonProvider.Set(kvp.Key, kvp.Value);
            }
        }
    }
}

// Trong Docker chỉ dùng HTTP, HTTPS sẽ được xử lý bởi reverse proxy (nginx)
// Port 8080 trong container sẽ được map ra port 5000 ở host
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080); // HTTP only - khớp với ASPNETCORE_URLS và docker port mapping
});

// ==========================
// Swagger cấu hình với JWT Authorization
// ==========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Thông tin API
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Cinema Ticket Booking API",
        Version = "v1",
        Description = "API quản lý đặt vé xem phim - Hỗ trợ JWT Authentication",
        Contact = new OpenApiContact
        {
            Name = "CineBook Team",
            Email = "support@cinebook.com"
        }
    });

    // Cấu hình JWT Authentication trong Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập JWT token của bạn vào đây. \n\n" +
                      "Ví dụ: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'\n\n" +
                      "Không cần thêm 'Bearer' phía trước, hệ thống tự động thêm."
    });

    // Yêu cầu JWT cho tất cả endpoints có [Authorize]
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// ==========================
// Cấu hình DbContext (PostgreSQL)
// ==========================
// Enable UTC timestamp for PostgreSQL
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(10),
            errorCodesToAdd: null
        )
    );
});

// ==========================
// Cấu hình JSON tránh lỗi vòng tham chiếu
// ==========================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// ==========================
// Cấu hình Redis
// ==========================
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConfig = builder.Configuration.GetSection("Redis");
    var configOptions = ConfigurationOptions.Parse(redisConfig["ConnectionString"]!);
    configOptions.AbortOnConnectFail = redisConfig.GetValue<bool>("AbortOnConnectFail");
    
    return ConnectionMultiplexer.Connect(configOptions);
});

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
    options.InstanceName = builder.Configuration["Redis:InstanceName"];
});

// ==========================
// Cấu hình Hangfire với PostgreSQL
// ==========================
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options =>
    {
        options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    }));

builder.Services.AddHangfireServer(options =>
{
    options.WorkerCount = 1; // Số worker xử lý background jobs
});

// Phase 2: Add Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>("postgresql")
    .AddCheck("redis", () =>
    {
        try
        {
            var sp = builder.Services.BuildServiceProvider();
            var redis = sp.GetRequiredService<IConnectionMultiplexer>();
            return redis.IsConnected
                ? Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("Redis connected")
                : Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Unhealthy("Redis disconnected");
        }
        catch (Exception ex)
        {
            return Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Unhealthy("Redis error", ex);
        }
    });

// Register background jobs
builder.Services.AddScoped<SeatHoldCleanupJob>();

// Register notification service
builder.Services.AddScoped<INotificationService, NotificationService>();

// Add HttpContextAccessor (required for MinioStorageService and other services)
builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IMinioStorageService, MinioStorageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();
builder.Services.AddScoped<ITicketService, TicketService>();

// Phase 2: Booking services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IDistributedLockService, DistributedLockService>();

// Payment & QR Code & Email services
builder.Services.AddScoped<VNPayService>();
builder.Services.AddScoped<QRCodeService>();
builder.Services.AddScoped<EmailService>();

// Chat AI service
builder.Services.AddScoped<IChatService, ChatService>();
// builder.Services.AddScoped<IGeminiService, GeminiService>(); // Commented out - service not implemented

// ⭐ RAG: Cinema RAG service
builder.Services.AddScoped<ICinemaRagService, CinemaRagService>();
// Dashboard service
builder.Services.AddScoped<IDashboardService, DashboardService>();

// ==========================
// Thêm Repository
// ==========================
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IStaffService, StaffService>();

// Phase 2: Customer repository
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
// ==========================
// Cấu hình Cloudinary
// ==========================
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

// ==========================
// Cấu hình JWT Authentication
// ==========================
builder.Services.AddSingleton<JwtTokenHelper>();

var jwtSettings = builder.Configuration.GetSection("Jwt");
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
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });

builder.Services.AddHttpClient("Groq", client =>
{
    var groqConfig = builder.Configuration.GetSection("Groq");

    client.BaseAddress = new Uri(groqConfig["BaseUrl"]!);
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue(
            "Bearer",
            groqConfig["ApiKey"]
        );
});



// ==========================
// Cấu hình CORS: cho phép frontend được gọi API
// ==========================
const string DevCorsPolicy = "DevCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(DevCorsPolicy, policy =>
    {
        policy.AllowAnyOrigin() // Cho phép MỌI domain/origin
              .AllowAnyMethod() // Cho phép MỌI method (GET, POST, PUT, DELETE...)
              .AllowAnyHeader(); // Cho phép MỌI header
    });
});

// Đăng ký Minio Client
builder.Services.AddSingleton<IMinioClient>(s =>
{
    var configuration = s.GetRequiredService<IConfiguration>();
    return new MinioClient()
        .WithEndpoint(configuration["Minio:Endpoint"])
        .WithCredentials(configuration["Minio:AccessKey"], configuration["Minio:SecretKey"])
        .WithSSL(configuration.GetValue<bool>("Minio:UseSsl"))
        .Build();
});

// ==========================
// Build app
// ==========================
var app = builder.Build();

// Tự động chạy migrations khi khởi động
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Chạy migrations tự động
        Console.WriteLine("Đang chạy database migrations...");
        context.Database.Migrate();
        Console.WriteLine("Migrations hoàn tất!");
        
        // Seed dữ liệu
        DataSeeder.Seed(context);
        Console.WriteLine("DataSeeder đã chạy thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Lỗi khi khởi tạo database: {ex.Message}");
    }
}

// ==========================
// Middleware Pipeline
// ==========================
// Enable Swagger in all environments (Development & Production)
app.UseSwagger();
app.UseSwaggerUI();

// ==========================
// Cấu hình Hangfire Dashboard
// ==========================
app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new HangfireDashboardAuthorizationFilter() },
    DashboardTitle = "CineBook Background Jobs"
});

// Phase 2: Health Checks Endpoint
app.MapHealthChecks("/health");

// Đăng ký recurring job: kiểm tra ghế sắp hết hạn mỗi 1 phút
RecurringJob.AddOrUpdate<SeatHoldCleanupJob>(
    "check-expiring-seat-holds",
    job => job.CheckExpiringSeatHolds(),
    "*/1 * * * *", // Cron: mỗi 1 phút
    new RecurringJobOptions
    {
        TimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time") // GMT+7
    });

// **QUAN TRỌNG: Bật CORS trước khi xử lý request**
app.UseCors(DevCorsPolicy);

app.UseHttpsRedirection();

// Thêm Authentication & Authorization cho JWT
app.UseAuthentication();
app.UseAuthorization();

// Redirect root path to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

// Map route cho Controller
app.MapControllers();

app.Run();