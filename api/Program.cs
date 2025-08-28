using dava_avukat_eslestirme_asistani;
using dava_avukat_eslestirme_asistani.Middlewares;
using dava_avukat_eslestirme_asistani.Repositories;
using dava_avukat_eslestirme_asistani.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// (İsteğe bağlı) başlangıçta label'ları yükle – log'a yazar
var labelsPath = builder.Configuration["Metrics:LabelsPath"];
var sheetName = builder.Configuration["Metrics:Sheet"] ?? "Labels";
if (string.IsNullOrWhiteSpace(labelsPath) || !File.Exists(labelsPath))
{
    Console.WriteLine($"[Metrics] Labels dosyası bulunamadı: {labelsPath}");
}
else
{
    try
    {
        dava_avukat_eslestirme_asistani.Data.LabelStore.LoadFromExcel(labelsPath!, sheetName);
        Console.WriteLine($"[Metrics] Loaded labels: {dava_avukat_eslestirme_asistani.Data.LabelStore.All.Count} cases");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Metrics] Load error: {ex.Message}");
    }
}

// CORS (geliştirme için serbest)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", p =>
        p.AllowAnyOrigin()
         .AllowAnyMethod()
         .AllowAnyHeader());
});

builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<ICaseService, CaseService>();
builder.Services.AddScoped<ILawyerService, LawyerService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Bağlantı dizesi adınız neyse onu verin. Örn: "DefaultConnection" / "sqlConnection"
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("sqlConnection")));

builder.Services.AddScoped<CandidateQueryService>();
builder.Services.AddHttpClient<LlmMatchService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
