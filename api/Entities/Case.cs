namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Case
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string CaseType { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime FiledDate { get; set; } = DateTime.UtcNow;

        public string City { get; set; } = string.Empty;

        public string Language { get; set; } = "Türkçe";

        public string UrgencyLevel { get; set; } = "Normal";

        public bool RequiresProBono { get; set; } = false;

        public int EstimatedDurationInDays { get; set; } = 0;

        public string RequiredExperienceLevel { get; set; } = "Orta";

        public bool IsActive { get; set; } = true;

        public int? WorkingGroupId { get; set; }

        public virtual WorkingGroup? WorkingGroup { get; set; }
    }



}
