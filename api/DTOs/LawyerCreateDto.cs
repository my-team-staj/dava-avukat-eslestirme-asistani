using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        public int ExperienceYears { get; set; } = 0;
        [Required]
        public string City { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string BaroNumber { get; set; } = string.Empty;
        public string LanguagesSpoken { get; set; } = string.Empty;
        public bool AvailableForProBono { get; set; } = false;
        public double Rating { get; set; } = 0;
        public int TotalCasesHandled { get; set; } = 0;
        public string Education { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int? WorkingGroupId { get; set; }
    }
}
