using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StudentApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// CORS (Allow ONLY your frontend)
var frontendUrl = "https://mango-sand-058a21a00.3.azurestaticapps.net";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins(frontendUrl)
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Student API",
        Version = "v1"
    });
});

// SQLite DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Run Migrations Automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();       // <---- IMPORTANT
}

app.UseSwagger();
app.UseSwaggerUI();

// Disable HTTPS redirect except local
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Apply CORS policy
app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
