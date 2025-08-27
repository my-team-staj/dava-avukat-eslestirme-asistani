namespace dava_avukat_eslestirme_asistani.DTOs.Match;

public record MatchChooseDto(int CaseId, int LawyerId, string? ChosenBy);

public record CaseLawyerMatchDto(
    int Id, int CaseId, int LawyerId, DateTime ChosenAt, string? ChosenBy
);
