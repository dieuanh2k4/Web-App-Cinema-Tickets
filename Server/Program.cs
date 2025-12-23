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
using Minio;

var builder = WebApplication.CreateBuilder(args);

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
// Đăng ký các Service (DI)
// ==========================
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IMinioStorageService, MinioStorageService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();
builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<JwtTokenHelper>();

// Phase 2: Booking services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBookingService, BookingService>();

// Payment & QR Code & Email services
builder.Services.AddScoped<VNPayService>();
builder.Services.AddScoped<QRCodeService>();
builder.Services.AddScoped<EmailService>();

// ==========================
// Thêm Repository
// ==========================
builder.Services.AddScoped<IUserRepository, UserRepository>();

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

// ==========================
// Cấu hình CORS: cho phép frontend được gọi API
// ==========================
const string DevCorsPolicy = "DevCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(DevCorsPolicy, policy =>
    {
        policy.AllowAnyOrigin() // Cho phép MỌI domain
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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Thêm Authentication & Authorization cho JWT
app.UseAuthentication();
app.UseAuthorization();

// Redirect root path to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

// Map route cho Controller
app.MapControllers();

app.Run();