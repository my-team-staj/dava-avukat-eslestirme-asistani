namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Language { get; set; } = "Türkçe";
        public string UrgencyLevel { get; set; } = "Normal";
        public bool RequiresProBono { get; set; } = false;
        public int EstimatedDurationInDays { get; set; } = 1;
        public string RequiredExperienceLevel { get; set; } = "Orta";
        public DateTime FiledDate { get; set; }
        public bool IsActive { get; set; } = true;

        public string WorkGroup { get; set; } = string.Empty;
    }
}
