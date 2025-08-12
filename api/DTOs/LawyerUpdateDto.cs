namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerUpdateDto
    {
        public string Name { get; set; }
        public int ExperienceYears { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string BaroNumber { get; set; }
        public string LanguagesSpoken { get; set; }
        public bool AvailableForProBono { get; set; }
        public double Rating { get; set; }
        public int TotalCasesHandled { get; set; }
        public string Education { get; set; }
        public bool IsActive { get; set; }
        public int? WorkingGroupId { get; set; }
    }
}
