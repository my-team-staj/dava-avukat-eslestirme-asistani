using dava_avukat_eslestirme_asistani;
using dava_avukat_eslestirme_asistani.Middlewares;
using dava_avukat_eslestirme_asistani.Repositories;
using dava_avukat_eslestirme_asistani.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<ICaseService, CaseService>();
builder.Services.AddScoped<ILawyerService, LawyerService>();

// CORS EKLE
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:3000") // React adresi
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Di?er servisler...
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
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
