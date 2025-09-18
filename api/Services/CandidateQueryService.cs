using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dava_avukat_eslestirme_asistani;
using dava_avukat_eslestirme_asistani.DTOs.Match;

namespace dava_avukat_eslestirme_asistani.Services
{
    /// <summary>
    /// Case özeti + LLM'e gidecek aday kartlarını hazırlar.
    /// SQL tarafında daraltma: şehir + silinmemiş (WG filtresi YOK).
    /// Bellek tarafında sıralama ve top-N uygulanır.
    /// </summary>
    public class CandidateQueryService
    {
        private readonly AppDbContext _db;
        public CandidateQueryService(AppDbContext db) => _db = db;

        public async Task<(CaseSummary caseSum, List<LawyerCard> candidates)> BuildAsync(int caseId, int take = 30)
        {
            // 1) CASE — LLM'in kullanacağı alanlar (+ WG bilgisi)
            var c = await _db.Cases.AsNoTracking()
                .Where(x => x.Id == caseId && !x.IsDeleted)
                .Select(x => new
                {
                    x.Id,
                    x.FileSubject,
                    x.PrmNatureOfAssignment,
                    x.PrmCasePlaceofUseSubject,
                    x.SubjectMatterDescription,
                    x.IsToBeInvoiced,
                    x.City,
                    x.Description,
                    x.WorkingGroupId,
                    WorkingGroupName = x.WorkingGroup != null ? x.WorkingGroup.GroupName : null
                })
                .FirstOrDefaultAsync();

            if (c is null)
                throw new KeyNotFoundException($"Case {caseId} bulunamadı ya da silinmiş.");

            // 2) Aday havuzu (SQL ön daraltma: şehir + silinmemiş) — WG filtresi YOK
            const int SQL_TAKE = 200;
            var now = DateTime.UtcNow;

            var lawyers = _db.Lawyers.AsNoTracking().Where(l => !l.IsDeleted);

            // Şehir filtresi: boş değilse uygula
            if (!string.IsNullOrWhiteSpace(c.City))
                lawyers = lawyers.Where(l => l.City == c.City);

            var sqlCandidates = await lawyers
                .Select(l => new
                {
                    l.Id,
                    l.City,
                    l.Languages,
                    l.Title,
                    l.Education,
                    l.WorkingGroupId,
                    WorkGroupName = l.WorkingGroup != null ? l.WorkingGroup.GroupName : null,
                    l.StartDate,
                    l.IsActive,
                    l.PrmEmployeeRecordType,
                    ExperienceYears = l.StartDate.HasValue
                        ? EF.Functions.DateDiffYear(l.StartDate.Value, now)
                        : 0
                })
                .OrderByDescending(l => l.IsActive)
                .ThenByDescending(l => l.ExperienceYears)
                .ThenBy(l => l.WorkGroupName)
                .Take(SQL_TAKE)
                .ToListAsync();

            // 3) Heuristik sıralama + top-N (bellek)
            var finalCandidates = sqlCandidates
                .OrderByDescending(l => l.IsActive)
                .ThenByDescending(l => l.ExperienceYears)
                .ThenBy(l => l.WorkGroupName)
                .Take(take)
                .Select(l => new LawyerCard(
                    Id: l.Id,
                    ExperienceYears: l.ExperienceYears,
                    City: l.City ?? string.Empty,
                    Languages: string.IsNullOrWhiteSpace(l.Languages)
                        ? Array.Empty<string>()
                        : l.Languages.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                     .Select(s => s.Trim())
                                     .Where(s => !string.IsNullOrWhiteSpace(s))
                                     .ToArray(),
                    Title: l.Title,
                    Education: l.Education,
                    WorkGroupId: l.WorkingGroupId ?? 0,
                    WorkGroup: l.WorkGroupName,
                    StartDate: l.StartDate,
                    IsActive: l.IsActive,
                    PrmEmployeeRecordType: l.PrmEmployeeRecordType
                ))
                .ToList();

            // 4) CaseSummary (WG bilgisiyle)
            var caseSum = new CaseSummary(
                Id: c.Id,
                FileSubject: c.FileSubject ?? string.Empty,
                PrmNatureOfAssignment: c.PrmNatureOfAssignment ?? string.Empty,
                PrmCasePlaceofUseSubject: c.PrmCasePlaceofUseSubject ?? string.Empty,
                SubjectMatterDescription: c.SubjectMatterDescription ?? string.Empty,
                IsToBeInvoiced: c.IsToBeInvoiced,
                City: c.City ?? string.Empty,
                Description: c.Description ?? string.Empty,
                WorkingGroupId: c.WorkingGroupId,
                WorkingGroupName: c.WorkingGroupName
            );

            return (caseSum, finalCandidates);
        }
    }
}
