using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseCreateDto
    {
        [Required(ErrorMessage = "Dava başlığı zorunludur.")]
        [StringLength(100, ErrorMessage = "Başlık en fazla 100 karakter olabilir.")]
        public string? Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        public string? Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dava tarihi zorunludur.")]
        public DateTime? FiledDate { get; set; }

        [Required(ErrorMessage = "Şehir bilgisi zorunludur.")]
        public string? City { get; set; } = string.Empty;

        public string Language { get; set; } = "Türkçe";
        public string UrgencyLevel { get; set; } = "Normal";
        public bool RequiresProBono { get; set; } = false;
        [Range(1, 365, ErrorMessage = "Tahmini süre 1 ile 365 gün arasında olmalıdır.")]
        public int EstimatedDurationInDays { get; set; } = 1;
        public string RequiredExperienceLevel { get; set; } = "Orta";
        public string WorkGroup { get; set; } = string.Empty;
    }
}
