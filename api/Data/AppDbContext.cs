using dava_avukat_eslestirme_asistani.Entities;
using Microsoft.EntityFrameworkCore;
using System;

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

        // --- WorkingGroup seed ---
        modelBuilder.Entity<WorkingGroup>().HasData(
            new WorkingGroup { Id = 1, GroupName = "PATENT", GroupDescription = "Patent işleri", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 2, GroupName = "ARAŞTIRMA", GroupDescription = "Araştırma ve inceleme işleri", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 3, GroupName = "FM TAKLİTLE MÜCADELE", GroupDescription = "Taklit ürünlere karşı mücadele", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 4, GroupName = "MARKA, TELİF, TASARIM", GroupDescription = "Marka, telif ve tasarım hukuku", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 5, GroupName = "ŞİRKETLER ve SÖZLEŞMELER", GroupDescription = "Şirketler hukuku ve sözleşmeler", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 6, GroupName = "TESCİL", GroupDescription = "Tescil işlemleri", CreatedAt = new DateTime(2025, 9, 10) },
            new WorkingGroup { Id = 7, GroupName = "TİCARİ DAVA", GroupDescription = "Ticari davalar", CreatedAt = new DateTime(2025, 9, 10) }
        );

        // ---- Lawyer seed (örnek bir tane) ----
        modelBuilder.Entity<Lawyer>().HasData(
            new Lawyer
            {
                Id = 1,
                FullName = "Av. Berat Çalık",
                IsActive = true,
                City = "Ankara",
                Title = "Avukat",
                Phone = "05367750225",
                Email = "berat.calik@gun.av.tr",
                StartDate = new DateTime(2020, 9, 1),
                Languages = "Türkçe, İngilizce",
                Education = "Ankara Üniversitesi Hukuk Fakültesi",
                PrmEmployeeRecordType = "Associate",
                WorkingGroupId = 1,
                IsDeleted = false
            }
        );
    }
}
