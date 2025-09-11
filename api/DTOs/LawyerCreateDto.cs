using System;
using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerCreateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        [Required]
        public string City { get; set; } = string.Empty;

        public string? Title { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public DateTime? StartDate { get; set; }

        public string? Languages { get; set; } = string.Empty;

        public string? Education { get; set; } = string.Empty;

        public string? PrmEmployeeRecordType { get; set; } = string.Empty;

        // İlişki (Entity'de WorkingGroupId)
        public int? WorkGroupId { get; set; }
    }
}
