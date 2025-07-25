using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class UpdateLawyerDto
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string BarNumber { get; set; }
        public string Expertise { get; set; }
        public int ExperienceYears { get; set; }
        public string Location { get; set; }
        public int? WorkingGroupId { get; set; }
        public WorkingGroup WorkingGroup { get; set; }


    }
}