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

        private static string Normalize(string s) => (s ?? string.Empty).Trim().ToLowerInvariant();

        private static string[] TokenizeLangs(string? langs)
        {
            if (string.IsNullOrWhiteSpace(langs)) return Array.Empty<string>();
            return langs.Split(new[] { ',', ';', '|', '/', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrWhiteSpace(x))
                        .ToArray();
        }

        /// <summary>
        /// Case özetini ve LLM'e verilecek aday avukat kartlarını döndürür.
        /// SQL: şehir + pro bono + (WG varsa) + aktif; Bellek: dil eşleşmesi.
        /// </summary>
        public async Task<(CaseSummary caseSum, List<LawyerCard> candidates)> BuildAsync(int caseId, int take = 30)
        {
            // 1) CASE
            var c = await _db.Cases.AsNoTracking()
                .Where(x => x.Id == caseId && x.IsActive)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.Description,
                    x.City,
                    x.Language,
                    x.UrgencyLevel,              // string
                    x.RequiresProBono,           // bool
                    x.WorkingGroupId,            // int?
                    x.RequiredExperienceLevel,   // string
                    x.EstimatedDurationInDays    // int
                })
                .FirstOrDefaultAsync();

            if (c is null)
                throw new KeyNotFoundException($"Case {caseId} bulunamadı ya da pasif.");

            // 2) SQL ön-daraltma
            const int SQL_TAKE = 200;
            var q = _db.Lawyers.AsNoTracking()
                .Where(l => l.IsActive)
                .Where(l => l.City == c.City);
                // AvailableForProBono alanı kaldırıldı, WorkGroup ile değiştirildi

            // WorkingGroupId referansı kaldırıldı, WorkGroup string alanı kullanılıyor

            var sqlCandidates = await q
                .OrderByDescending(l => l.StartDate)
                .Take(SQL_TAKE)
                .Select(l => new
                {
                    l.Id,
                    l.FullName,
                    l.City,
                    l.Languages,
                    l.WorkGroup,
                    l.Title,
                    l.StartDate,
                    l.Education,
                    l.PrmEmployeeRecordType
                })
                .ToListAsync();

            // 3) Dil eşleşmesi (token bazlı)
            var wantedLang = Normalize(c.Language ?? string.Empty);

            var langMatched = sqlCandidates
                .Select(l => new
                {
                    l.Id,
                    l.FullName,
                    l.City,
                    Tokens = TokenizeLangs(l.Languages).Select(Normalize).ToArray(),
                    l.WorkGroup,
                    l.Title,
                    l.StartDate,
                    l.Education,
                    l.PrmEmployeeRecordType
                })
                .Where(l => string.IsNullOrEmpty(wantedLang) || l.Tokens.Contains(wantedLang))
                .ToList();

            // 4) Heuristik sıralama ve top-N
            var finalCandidates = langMatched
                .OrderByDescending(l => l.StartDate)
                .Take(take)
                .Select(l => new LawyerCard(
                    Id: l.Id,
                    Name: l.FullName ?? string.Empty,
                    ExperienceYears: 0, // Eski alan kaldırıldı
                    City: l.City ?? string.Empty,
                    Languages: l.Tokens,
                    AvailableForProBono: false, // Eski alan kaldırıldı
                    Rating: 0.0, // Eski alan kaldırıldı
                    TotalCasesHandled: 0, // Eski alan kaldırıldı
                    WorkingGroupId: null,
                    WorkGroup: l.WorkGroup ?? string.Empty,
                    Title: l.Title ?? string.Empty,
                    StartDate: l.StartDate,
                    Education: l.Education ?? string.Empty,
                    PrmEmployeeRecordType: l.PrmEmployeeRecordType ?? string.Empty
                ))
                .ToList();

            // 5) CaseSummary
            var caseSum = new CaseSummary(
                Id: c.Id,
                Title: c.Title ?? string.Empty,
                Description: c.Description ?? string.Empty,
                City: c.City ?? string.Empty,
                Language: c.Language ?? string.Empty,
                UrgencyLevel: c.UrgencyLevel ?? "Normal",
                RequiresProBono: c.RequiresProBono,
                WorkingGroupId: c.WorkingGroupId,
                RequiredExperienceLevel: c.RequiredExperienceLevel ?? "Orta",
                EstimatedDurationInDays: c.EstimatedDurationInDays
            );

            return (caseSum, finalCandidates);
        }
    }
}
