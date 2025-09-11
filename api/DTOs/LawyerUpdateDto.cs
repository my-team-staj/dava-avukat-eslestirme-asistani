using System;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerUpdateDto
    {
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

        // DTO tarafýnda WorkGroupId, Entity'de WorkingGroupId ile eþlenecek
        public int? WorkGroupId { get; set; }
    }
}
