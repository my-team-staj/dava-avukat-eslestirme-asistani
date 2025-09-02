namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Lawyer
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int ExperienceYears { get; set; } = 0;

        public string City { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string BaroNumber { get; set; } = string.Empty;

        public string LanguagesSpoken { get; set; } = string.Empty;

        public bool AvailableForProBono { get; set; } = false;

        public double Rating { get; set; } = 0.0;

        public int TotalCasesHandled { get; set; } = 0;

        public string Education { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        // Foreign Key
        public int? WorkingGroupId { get; set; }

        // Navigation Property
        public virtual WorkingGroup? WorkingGroup { get; set; }

        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }

    }



}
