using dava_avukat_eslestirme_asistani.DTOs;

public class CreateMatchResultDto
{
    public int CaseId { get; set; }
    public int LawyerId { get; set; }
    public decimal Score { get; set; }
    public bool IsPrimary { get; set; }
}