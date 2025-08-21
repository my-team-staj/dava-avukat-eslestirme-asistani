namespace dava_avukat_eslestirme_asistani.DTOs.Match;

public record MatchRequest(int CaseId, int TopK = 3);

public record MatchCandidate(int LawyerId, double Score, string Reason);

public record MatchResponse(int CaseId, List<MatchCandidate> Candidates);

// LLM'e gidecek özetler
public record CaseSummary(
    int Id,
    string Title,
    string Description,
    string City,
    string Language,
    string UrgencyLevel,            // string (örn: "Normal")
    bool RequiresProBono,
    int? WorkingGroupId,            // null olabilir
    string RequiredExperienceLevel, // string (örn: "Orta")
    int EstimatedDurationInDays     // int
);

public record LawyerCard(
    int Id,
    string Name,
    int ExperienceYears,
    string City,
    string[] Languages,
    bool AvailableForProBono,
    double Rating,
    int TotalCasesHandled,
    int WorkingGroupId
);

