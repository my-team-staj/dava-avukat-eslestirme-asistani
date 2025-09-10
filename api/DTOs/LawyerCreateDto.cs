using System.ComponentModel.DataAnnotations;
using dava_avukat_eslestirme_asistani.Validation;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerCreateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        [Required]
        public string City { get; set; } = string.Empty;
        [WorkGroupValidation]
        public string WorkGroup { get; set; } = string.Empty;
        [TitleValidation]
        public string Title { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public string Languages { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        [EmployeeRecordTypeValidation]
        public string PrmEmployeeRecordType { get; set; } = string.Empty;
    }
}
