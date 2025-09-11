using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseUpdateDto
    {
        // === Zorunlu Alanlar ===
        [Required(ErrorMessage = "Müvekkil bilgisi zorunludur.")]
        public string ContactClient { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dosya konusu zorunludur.")]
        public string FileSubject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Sorumlu kişi bilgisi zorunludur.")]
        public string CaseResponsible { get; set; } = string.Empty;

        [Required(ErrorMessage = "Görevin niteliği zorunludur.")]
        public string PrmNatureOfAssignment { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kullanım yeri konusu zorunludur.")]
        public string PrmCasePlaceofUseSubject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Konu açıklaması zorunludur.")]
        public string SubjectMatterDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "Faturalandırma durumu zorunludur.")]
        public bool IsToBeInvoiced { get; set; } = false;

        [Required(ErrorMessage = "Şehir bilgisi zorunludur.")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        public string Description { get; set; } = string.Empty;

        // === Opsiyonel Alanlar ===
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Address { get; set; }
        public string? Attorney1 { get; set; }
        public string? Attorney2 { get; set; }
        public string? Attorney3 { get; set; }
    }
}
