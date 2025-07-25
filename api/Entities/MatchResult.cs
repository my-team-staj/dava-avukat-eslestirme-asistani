namespace dava_avukat_eslestirme_asistani.Entities
{
    public class MatchResult
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
