using dava_avukat_eslestirme_asistani.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace dava_avukat_eslestirme_asistani.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Lawyer> Lawyers { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<WorkingGroup> WorkingGroups { get; set; }
        public DbSet<MatchResult> MatchResults { get; set; }
    }
}
