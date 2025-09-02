using dava_avukat_eslestirme_asistani.Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lawyer> Lawyers { get; set; }
    public DbSet<Case> Cases { get; set; }
    public DbSet<WorkingGroup> WorkingGroups { get; set; }
    public DbSet<CaseLawyerMatch> CaseLawyerMatches { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Soft Delete Global Filters ----
        modelBuilder.Entity<Lawyer>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Case>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CaseLawyerMatch>().HasQueryFilter(e => !e.IsDeleted);

        // --- WorkingGroup seed (senin verdiğinle aynı) ---
        modelBuilder.Entity<WorkingGroup>().HasData(
            new WorkingGroup { Id = 1, GroupName = "Ceza Grubu", GroupDescription = "Ceza davaları için uzman ekip", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 2, GroupName = "Aile Hukuku Grubu", GroupDescription = "Boşanma, velayet ve nafaka gibi konularda uzmanlık", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 3, GroupName = "Ticaret Hukuku Grubu", GroupDescription = "Şirketler ve ticari uyuşmazlıklar", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 4, GroupName = "İş Hukuku Grubu", GroupDescription = "İşçi-işveren ilişkileri, tazminat davaları", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 5, GroupName = "Gayrimenkul ve Kira Grubu", GroupDescription = "Tapu, kat mülkiyeti ve kira sözleşmeleri", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 6, GroupName = "Tüketici Hakları Grubu", GroupDescription = "Tüketici uyuşmazlıkları, ayıplı mal davaları", CreatedAt = new DateTime(2025, 8, 4) },
            new WorkingGroup { Id = 7, GroupName = "İcra ve İflas Grubu", GroupDescription = "Borç tahsilatı, icra ve konkordato işlemleri", CreatedAt = new DateTime(2025, 8, 4) }
        );

        // ---- Lawyer seed (senin verdiğinle aynı) ----
        modelBuilder.Entity<Lawyer>().HasData(
            new Lawyer
            {
                Id = 1,
                Name = "Av. Berat",
                ExperienceYears = 5,
                City = "Ankara",
                Email = "berat.calik@gun.av.tr",
                Phone = "05367750225",
                BaroNumber = "123456",
                LanguagesSpoken = "Türkçe",
                AvailableForProBono = true,
                Rating = 4.8,
                TotalCasesHandled = 80,
                Education = "Ankara Üniversitesi Hukuk Fakültesi",
                IsActive = true,
                WorkingGroupId = 1,
                IsDeleted = false
            }
        );
    }
}
