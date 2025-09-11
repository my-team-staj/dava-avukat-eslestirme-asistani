using System;

namespace dava_avukat_eslestirme_asistani.Entities
{
    public class Lawyer
    {
        public int Id { get; set; }

        // Yeni alanlar (title listene göre)
        public string FullName { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string City { get; set; } = string.Empty;
        public string? Title { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public string? Languages { get; set; } = string.Empty;              // (LanguagesSpoken -> Languages)
        public string? Education { get; set; } = string.Empty;
        public string? PrmEmployeeRecordType { get; set; } = string.Empty;

        // İlişki (DB'de tablo/sınıf adı şimdilik WorkingGroup kalıyor)
        public int? WorkingGroupId { get; set; }
        public virtual WorkingGroup? WorkingGroup { get; set; }

        // Soft delete / audit (mevcut yapıyı koruduk)
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
    }
}
