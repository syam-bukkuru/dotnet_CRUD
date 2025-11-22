using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StudentApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // optional (keeps your model names same as DB)
    });

// Enable CORS (optional but recommended)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Student API",
        Version = "v1",
        Description = "Student Management API using SQL Server & ASP.NET Core"
    });
});

// Register DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();

// Middleware pipeline
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Student API v1");
    options.RoutePrefix = string.Empty; // API opens at root: https://localhost:xxxx/
});

app.UseHttpsRedirection();

// Enable CORS globally
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
