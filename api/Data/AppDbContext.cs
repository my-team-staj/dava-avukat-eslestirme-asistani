using dava_avukat_eslestirme_asistani.Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lawyer> Lawyers { get; set; }
    public DbSet<Case> Cases { get; set; }
    public DbSet<CaseLawyerMatch> CaseLawyerMatches { get; set; }
    public DbSet<WorkingGroup> WorkingGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---- Soft Delete Global Filters ----
        modelBuilder.Entity<Lawyer>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Case>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<CaseLawyerMatch>().HasQueryFilter(e => !e.IsDeleted);


        // ---- WorkingGroup seed ----
        modelBuilder.Entity<WorkingGroup>().HasData(
            new WorkingGroup { Id = 1, GroupName = "PATENT", GroupDescription = "Patent Hukuku", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 2, GroupName = "ARAŞTIRMA", GroupDescription = "Araştırma ve Geliştirme", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 3, GroupName = "FM TAKLİTLE MÜCADELE", GroupDescription = "Fikri Mülkiyet Taklit Mücadele", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 4, GroupName = "MARKA, TELİF, TASARIM", GroupDescription = "Marka, Telif ve Tasarım Hukuku", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 5, GroupName = "ŞİRKETLER ve SÖZLEŞMELER", GroupDescription = "Şirketler ve Sözleşmeler Hukuku", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 6, GroupName = "TESCİL", GroupDescription = "Tescil İşlemleri", CreatedAt = new DateTime(2024, 1, 1) },
            new WorkingGroup { Id = 7, GroupName = "TİCARİ DAVA", GroupDescription = "Ticari Dava Hukuku", CreatedAt = new DateTime(2024, 1, 1) }
        );

        // ---- Lawyer seed (yeni alan adlarıyla) ----
        modelBuilder.Entity<Lawyer>().HasData(
            new Lawyer
            {
                Id = 1,
                FullName = "Av. Berat Çalık",
                IsActive = true,
                City = "Ankara",
                WorkGroup = "TİCARİ DAVA",
                Title = "Kıdemli Avukat",
                Phone = "05367750225",
                Email = "berat.calik@gun.av.tr",
                StartDate = new DateTime(2020, 1, 15),
                Languages = "Türkçe, İngilizce",
                Education = "Ankara Üniversitesi Hukuk Fakültesi",
                PrmEmployeeRecordType = "FullTime",
                IsDeleted = false
            }
        );
    }
}
