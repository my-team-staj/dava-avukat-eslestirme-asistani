namespace dava_avukat_eslestirme_asistani.DTOs.Match
{
    public record MatchRequest(int CaseId, int TopK = 3);

    public record MatchCandidate(int LawyerId, double Score, string Reason);

    public record MatchResponse(int CaseId, List<MatchCandidate> Candidates);

    // LLM'e gidecek özetler (Case entity'ye göre güncellendi)
    public record CaseSummary(
        int Id,
        string ContactClient,
        string FileSubject,
        string CaseResponsible,
        string PrmNatureOfAssignment,
        string PrmCasePlaceofUseSubject,
        string SubjectMatterDescription,
        bool IsToBeInvoiced,
        string City,
        string Description,
        string? Country,
        string? County,
        string? Address,
        string? Attorney1,
        string? Attorney2,
        string? Attorney3
    );

    // Yeni şema ile uyumlu Lawyer kartı
    public record LawyerCard(
        int Id,
        string FullName,
        int ExperienceYears,
        string City,
        string[] Languages,
        string? Title,
        string? Education,
        int WorkGroupId,
        string? WorkGroup
    );
}
