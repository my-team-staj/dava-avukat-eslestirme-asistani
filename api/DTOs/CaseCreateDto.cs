using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseCreateDto
    {
        [Required(ErrorMessage = "Dava başlığı zorunludur.")]
        [StringLength(100, ErrorMessage = "Başlık en fazla 100 karakter olabilir.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Dava türü zorunludur.")]
        public string CaseType { get; set; }

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Şehir bilgisi zorunludur.")]
        public string City { get; set; }

        public string Language { get; set; } = "Türkçe";

        public string UrgencyLevel { get; set; } = "Normal";

        public bool RequiresProBono { get; set; } = false;

        [Range(1, 365, ErrorMessage = "Tahmini süre 1 ile 365 gün arasında olmalıdır.")]
        public int EstimatedDurationInDays { get; set; }

        public string RequiredExperienceLevel { get; set; } = "Orta";

        public int? WorkingGroupId { get; set; }
    }
}
