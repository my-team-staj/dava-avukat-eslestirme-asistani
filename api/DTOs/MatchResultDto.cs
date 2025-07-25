using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani.DTOs

{
    public class MatchResultDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public int LawyerId { get; set; }
        public decimal Score { get; set; }
        public bool IsPrimary { get; set; }
        public DateTime CreatedAt { get; set; }
        public Case Case { get; set; }
        public Lawyer Lawyer { get; set; }

    }
}
// This code defines a Data Transfer Object (DTO) for MatchResult, which is used to transfer data between different layers of the application.