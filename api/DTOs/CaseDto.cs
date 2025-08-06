namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public string Language { get; set; }
        public string UrgencyLevel { get; set; }
        public bool RequiresProBono { get; set; }
        public int EstimatedDurationInDays { get; set; }
        public string RequiredExperienceLevel { get; set; }
        public DateTime FiledDate { get; set; }
        public bool IsActive { get; set; }

        public int? WorkingGroupId { get; set; }
        public string? WorkingGroupName { get; set; }
    }
}
