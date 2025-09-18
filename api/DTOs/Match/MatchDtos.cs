using System;
using System.Collections.Generic;

namespace dava_avukat_eslestirme_asistani.DTOs.Match
{
    public record MatchRequest(int CaseId, int TopK = 3);

    public record MatchCandidate(int LawyerId, double Score, string Reason);

    public record MatchResponse(int CaseId, List<MatchCandidate> Candidates);

    /// LLM’e gidecek DAVA özeti (privacy: sadece paylaşılanlar + Description)
    public record CaseSummary(
        int Id,
        string FileSubject,
        string PrmNatureOfAssignment,
        string PrmCasePlaceofUseSubject,
        string SubjectMatterDescription,
        bool IsToBeInvoiced,
        string City,
        string Description,
        int? WorkingGroupId,      // << eklendi (puanlamada bonus için)
        string? WorkingGroupName  // << eklendi (neden/metin için)
    );

    /// LLM’e gidecek AVUKAT kartı (privacy: ad/e-posta/telefon yok)
    public record LawyerCard(
        int Id,
        int ExperienceYears,        // StartDate’ten hesaplanıyor
        string City,
        string[] Languages,
        string? Title,
        string? Education,
        int WorkGroupId,
        string? WorkGroup,
        DateTime? StartDate,              // (paylaşılır)
        bool IsActive,               // (paylaşılır)
        string? PrmEmployeeRecordType   // (paylaşılır)
    );
}
