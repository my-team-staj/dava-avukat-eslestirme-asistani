    namespace dava_avukat_eslestirme_asistani.Entities
{
    public class WorkingGroup
    {
        public int Id { get; set; }

        public string GroupName { get; set; } = string.Empty;

        public string GroupDescription { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<Lawyer> Lawyers { get; set; } = new List<Lawyer>();

        public virtual ICollection<Case> Cases { get; set; } = new List<Case>();
    }


}
