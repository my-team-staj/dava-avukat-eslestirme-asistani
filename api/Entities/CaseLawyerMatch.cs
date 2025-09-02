namespace dava_avukat_eslestirme_asistani.Entities;

public class CaseLawyerMatch
{
    public int Id { get; set; }
    public int CaseId { get; set; }
    public int LawyerId { get; set; }
    public DateTime ChosenAt { get; set; } = DateTime.UtcNow;
    public string? ChosenBy { get; set; }

    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }

}
