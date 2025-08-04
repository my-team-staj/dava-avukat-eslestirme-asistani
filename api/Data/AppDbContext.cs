using dava_avukat_eslestirme_asistani.Entities;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;


public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Lawyer> Lawyers { get; set; }
    public DbSet<Case> Cases { get; set; }
    public DbSet<WorkingGroup> WorkingGroups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // WorkingGroup seed
        modelBuilder.Entity<WorkingGroup>().HasData(
            new WorkingGroup
            {
                Id = 1,
                GroupName = "Ceza Grubu",
                GroupDescription = "Ceza davaları için uzman ekip",
                CreatedAt = new DateTime(2025, 8, 4)
            }
        );

        // Lawyer seed
        modelBuilder.Entity<Lawyer>().HasData(
            new Lawyer
            {
                Id = 1,
                Name = "Av. Berat",
                Specialization = "Ceza",
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
                WorkingGroupId = 1
            }
        );
    }

}
