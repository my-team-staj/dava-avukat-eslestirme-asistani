namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Case
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public int? AssignedLawyerId { get; set; }

    }
}
