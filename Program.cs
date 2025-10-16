using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.src.Data;
using Server.src.Repositories.Interfaces;
using Server.src.Repositories.Implements;
using Server.src.Services.Interfaces;
using Server.src.Services.Implements;
using Server.src.Utils;

var builder = WebApplication.CreateBuilder(args);

// -------------------- Add services --------------------

// 1️⃣ DbContext (PostgreSQL hoặc SQL Server)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    // Nếu dùng SQL Server thì bật dòng dưới:
    // options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 2️⃣ Controller + JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// 3️⃣ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4️⃣ Các service nghiệp vụ
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<ITheaterService, TheaterService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<ITicketPriceService, TicketPriceService>();

// 5️⃣ Cấu hình Cloudinary (nếu có)
builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings")
);

// 6️⃣ Thêm Repository và AuthService
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton<JwtTokenHelper>();

// 7️⃣ JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

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
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

// -------------------- Build app --------------------
var app = builder.Build();
// Gọi seeder khởi tạo dữ liệu
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DataSeeder.Seed(dbContext);
}

// -------------------- Configure pipeline --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();  // ✅ Bắt buộc trước Authorization
app.UseAuthorization();

app.MapControllers();

app.Run();
