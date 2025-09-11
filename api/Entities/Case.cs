using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Case
    {
        public int Id { get; set; }

        // === Zorunlu Alanlar ===
        [Required]
        public string ContactClient { get; set; } = string.Empty;

        [Required]
        public string FileSubject { get; set; } = string.Empty;

        [Required]
        public string CaseResponsible { get; set; } = string.Empty;

        [Required]
        public string PrmNatureOfAssignment { get; set; } = string.Empty;

        [Required]
        public string PrmCasePlaceofUseSubject { get; set; } = string.Empty;

        [Required]
        public string SubjectMatterDescription { get; set; } = string.Empty;

        [Required]
        public bool IsToBeInvoiced { get; set; } = false;

        [Required]
        public string City { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        // === Opsiyonel Alanlar ===
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Address { get; set; }
        public string? Attorney1 { get; set; }
        public string? Attorney2 { get; set; }
        public string? Attorney3 { get; set; }

        // === Soft delete alanları ===
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
    }
}
