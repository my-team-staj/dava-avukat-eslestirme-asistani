namespace dava_avukat_eslestirme_asistani.Entities
{
    public class WorkingGroup
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Lawyer> Members { get; set; }

    }
}
