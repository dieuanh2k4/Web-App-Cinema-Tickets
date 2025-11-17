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
// Cấu hình DbContext (PostgreSQL hoặc InMemory nếu chưa có DB thật)
// ==========================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
// Dùng PostgreSQL thật:
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));

// 👉 Nếu bạn chưa cài PostgreSQL, có thể tạm dùng InMemory để test:
// options.UseInMemoryDatabase("TestDB");


});

// ==========================
// Cấu hình JSON tránh lỗi vòng tham chiếu
// ==========================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();
builder.Services.AddScoped<IShowtimeService, ShowtimeService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtTokenHelper>();

// ==========================
// Thêm Repository
// ==========================
builder.Services.AddScoped<IUserRepository, UserRepository>();

// ==========================
// Cấu hình Cloudinary
// ==========================
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings")
);

// ==========================
// Cấu hình JWT Authentication
// ==========================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "")
            )
        };
    }
);


// ==========================
// Build app
// ==========================
var app = builder.Build();

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