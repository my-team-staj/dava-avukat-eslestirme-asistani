using dava_avukat_eslestirme_asistani;
using dava_avukat_eslestirme_asistani.Middlewares;
using dava_avukat_eslestirme_asistani.Repositories;
using dava_avukat_eslestirme_asistani.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// --- CORS Policy Definitions (ikisi de tanımlanıyor!) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

    options.AddPolicy("ReactLocal",
        policy => policy
            .WithOrigins("http://localhost:3000") // React adresi
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Controllers ve diğer servisler
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<ICaseService, CaseService>();
builder.Services.AddScoped<ILawyerService, LawyerService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("sqlConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS middleware'i burada! 
// Hangisini aktif etmek istersen ona göre çağırırsın:
app.UseCors("ReactLocal");  // Sadece React için izin ver
// veya
// app.UseCors("AllowAll"); // Herkese açık yapmak için (güvenlik için prod'da önerilmez)

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
