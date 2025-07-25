using dava_avukat_eslestirme_asistani.Entities;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class WorkingGroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<Lawyer> Members { get; set; }

    }
}