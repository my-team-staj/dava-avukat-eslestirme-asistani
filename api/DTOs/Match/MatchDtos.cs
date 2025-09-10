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
    int ExperienceYears, // Eski alan, geriye dönük uyumluluk için korundu
    string City,
    string[] Languages,
    bool AvailableForProBono, // Eski alan, geriye dönük uyumluluk için korundu
    double Rating, // Eski alan, geriye dönük uyumluluk için korundu
    int TotalCasesHandled, // Eski alan, geriye dönük uyumluluk için korundu
    int? WorkingGroupId, // Eski alan, geriye dönük uyumluluk için korundu
    string WorkGroup = "",
    string Title = "",
    DateTime StartDate = default,
    string Education = "",
    string PrmEmployeeRecordType = ""
);

