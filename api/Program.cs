using Microsoft.EntityFrameworkCore;
using dava_avukat_eslestirme_asistani.Data;

var builder = WebApplication.CreateBuilder(args);

// DbContext tan?m? (EF Core ba?lant?s?)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controller ve servisleri ekle
builder.Services.AddControllers();

// Swagger (API dokümantasyonu)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Geli?tirme ortam?ysa Swagger'? göster
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
