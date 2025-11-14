using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.src.Data;
using Server.src.Services.Implements;
using Server.src.Services.Interfaces;
using Server.src.Repositories.Implements;
using Server.src.Repositories.Interfaces;
using Server.src.Utils;

var builder = WebApplication.CreateBuilder(args);

// ==========================
// Swagger cấu hình cơ bản
// ==========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// ==========================
// Đăng ký các Service (DI)
// ==========================
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();

// ==========================
// Thêm Repository
// ==========================
builder.Services.AddScoped<IUserRepository, UserRepository>();

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

builder.Services.AddAuthorization();

// ==========================
// Build app
// ==========================
var app = builder.Build();

// 👉 **THÊM ĐOẠN NÀY: Chạy DataSeeder khi app khởi động**
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        DataSeeder.Seed(context); // ✅ Gọi DataSeeder
        Console.WriteLine("✅ DataSeeder đã chạy thành công!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Lỗi khi chạy DataSeeder: {ex.Message}");
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
app.MapControllers();

app.Run();