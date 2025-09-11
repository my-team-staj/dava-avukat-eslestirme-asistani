using System;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerDto
    {
        public int Id { get; set; }

        // Yeni title'lar
        public string FullName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string City { get; set; } = string.Empty;
        public string? Title { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public string? Languages { get; set; } = string.Empty;
        public string? Education { get; set; } = string.Empty;
        public string? PrmEmployeeRecordType { get; set; } = string.Empty;

        // WorkGroup alanları (DB: WorkingGroup)
        public int? WorkGroupId { get; set; }           // Entity'de WorkingGroupId
        public string? WorkGroup { get; set; }          // Navigation'dan görünen ad (WorkingGroup.Name vb.)
    }
}
