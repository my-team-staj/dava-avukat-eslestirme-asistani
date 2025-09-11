using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dava_avukat_eslestirme_asistani;                // AppDbContext
using dava_avukat_eslestirme_asistani.DTOs.Match;     // CaseSummary, LawyerCard

namespace dava_avukat_eslestirme_asistani.Services
{
    public class CandidateQueryService
    {
        private readonly AppDbContext _db;
        public CandidateQueryService(AppDbContext db) => _db = db;

        /// <summary>
        /// Case özetini ve LLM'e verilecek aday avukat kartlarını döndürür.
        /// SQL: şehir + soft delete dışı; Bellek: sıralama.
        /// </summary>
        public async Task<(CaseSummary caseSum, List<LawyerCard> candidates)> BuildAsync(int caseId, int take = 30)
        {
            // 1) CASE
            var c = await _db.Cases.AsNoTracking()
                .Where(x => x.Id == caseId && !x.IsDeleted)
                .Select(x => new
                {
                    x.Id,
                    x.ContactClient,
                    x.FileSubject,
                    x.CaseResponsible,
                    x.PrmNatureOfAssignment,
                    x.PrmCasePlaceofUseSubject,
                    x.SubjectMatterDescription,
                    x.IsToBeInvoiced,
                    x.City,
                    x.Description,
                    x.Country,
                    x.County,
                    x.Address,
                    x.Attorney1,
                    x.Attorney2,
                    x.Attorney3
                })
                .FirstOrDefaultAsync();

            if (c is null)
                throw new KeyNotFoundException($"Case {caseId} bulunamadı ya da silinmiş.");

            // 2) SQL ön-daraltma
            const int SQL_TAKE = 200;
            var q = _db.Lawyers.AsNoTracking()
                .Where(l => !l.IsDeleted)
                .Where(l => l.City == c.City);

            var now = DateTime.UtcNow;

            var sqlCandidates = await q
                .Select(l => new
                {
                    l.Id,
                    l.FullName,
                    l.City,
                    l.Languages,
                    l.Title,
                    l.Education,
                    l.WorkingGroupId,
                    WorkGroupName = l.WorkingGroup != null ? l.WorkingGroup.GroupName : null,
                    IsActive = l.IsActive,
                    ExperienceYears = l.StartDate.HasValue
                        ? EF.Functions.DateDiffYear(l.StartDate.Value, now)
                        : 0
                })
                .OrderByDescending(l => l.IsActive)
                .ThenByDescending(l => l.ExperienceYears)
                .ThenBy(l => l.FullName)
                .Take(SQL_TAKE)
                .ToListAsync();

            // 3) Heuristik sıralama ve top-N
            var finalCandidates = sqlCandidates
                .OrderByDescending(l => l.IsActive)
                .ThenByDescending(l => l.ExperienceYears)
                .ThenBy(l => l.FullName)
                .Take(take)
                .Select(l => new LawyerCard(
                    Id: l.Id,
                    FullName: l.FullName ?? string.Empty,
                    ExperienceYears: l.ExperienceYears,
                    City: l.City ?? string.Empty,
                    Languages: string.IsNullOrWhiteSpace(l.Languages)
                        ? Array.Empty<string>()
                        : l.Languages.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                     .Select(s => s.Trim()).ToArray(),
                    Title: l.Title,
                    Education: l.Education,
                    WorkGroupId: l.WorkingGroupId ?? 0,
                    WorkGroup: l.WorkGroupName
                ))
                .ToList();

            // 4) CaseSummary
            var caseSum = new CaseSummary(
                Id: c.Id,
                ContactClient: c.ContactClient ?? string.Empty,
                FileSubject: c.FileSubject ?? string.Empty,
                CaseResponsible: c.CaseResponsible ?? string.Empty,
                PrmNatureOfAssignment: c.PrmNatureOfAssignment ?? string.Empty,
                PrmCasePlaceofUseSubject: c.PrmCasePlaceofUseSubject ?? string.Empty,
                SubjectMatterDescription: c.SubjectMatterDescription ?? string.Empty,
                IsToBeInvoiced: c.IsToBeInvoiced,
                City: c.City ?? string.Empty,
                Description: c.Description ?? string.Empty,
                Country: c.Country,
                County: c.County,
                Address: c.Address,
                Attorney1: c.Attorney1,
                Attorney2: c.Attorney2,
                Attorney3: c.Attorney3
            );

            return (caseSum, finalCandidates);
        }
    }
}
