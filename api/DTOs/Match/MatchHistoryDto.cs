using System;

namespace dava_avukat_eslestirme_asistani.DTOs.Match
{
    public class MatchHistoryItemDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public int LawyerId { get; set; }
        public string LawyerFullName { get; set; } = string.Empty;
        public string? CaseFileSubject { get; set; }
        public DateTime MatchedAt { get; set; }
        public double Score { get; set; }
    }
}
