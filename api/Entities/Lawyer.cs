namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Lawyer
    {
        public int Id {  get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string BarNumber {  get; set; }
        public string Expertise { get; set; }
        public int ExperienceYears { get; set; }
        public string Location { get; set; }
        public int? WorkingGroupId { get; set; }
        public WorkingGroup WorkingGroup { get; set; }


    }
}
