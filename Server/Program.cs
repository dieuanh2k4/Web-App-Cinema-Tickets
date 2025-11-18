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
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ==========================
// Cấu hình JSON tránh lỗi vòng tham chiếu
// ==========================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();

builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();

// Phase 2: Booking services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<JwtTokenHelper>();

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
// Cấu hình Authorization Policies
// ==========================
builder.Services.AddAuthorization(options =>
{
    // Policy chỉ cho Admin
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole("Admin"));
    
    // Policy cho Staff hoặc Admin
    options.AddPolicy("StaffOrAdmin", policy => 
        policy.RequireRole("Admin", "Staff"));
    
    // Policy yêu cầu đăng nhập (bất kỳ role nào)
    options.AddPolicy("Authenticated", policy => 
        policy.RequireAuthenticatedUser());
});

// ==========================
// Build app
// ==========================
var app = builder.Build();

// **THÊM ĐOẠN NÀY: Chạy DataSeeder khi app khởi động**
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        DataSeeder.Seed(context); // Gọi DataSeeder
        Console.WriteLine("DataSeeder đã chạy thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Lỗi khi chạy DataSeeder: {ex.Message}");
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

// Map route cho Controller
app.UseCors(DevCorsPolicy);
app.MapControllers();

app.Run();