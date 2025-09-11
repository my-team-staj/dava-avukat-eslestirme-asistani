namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseDto
    {
        public int Id { get; set; }

        // === Zorunlu Alanlar ===
        public string ContactClient { get; set; } = string.Empty;
        public string FileSubject { get; set; } = string.Empty;
        public string CaseResponsible { get; set; } = string.Empty;
        public string PrmNatureOfAssignment { get; set; } = string.Empty;
        public string PrmCasePlaceofUseSubject { get; set; } = string.Empty;
        public string SubjectMatterDescription { get; set; } = string.Empty;
        public bool IsToBeInvoiced { get; set; } = false;
        public string City { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // === Opsiyonel Alanlar ===
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Address { get; set; }
        public string? Attorney1 { get; set; }
        public string? Attorney2 { get; set; }
        public string? Attorney3 { get; set; }

        // Soft delete alanları DTO’da genelde olmaz, ama ileride gerekirse eklenebilir.
    }
}
