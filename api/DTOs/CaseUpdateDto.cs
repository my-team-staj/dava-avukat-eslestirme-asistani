using System.ComponentModel.DataAnnotations;

namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseUpdateDto
    {
        // === Zorunlu Alanlar (mevcut) ===
        [Required(ErrorMessage = "Müvekkil bilgisi zorunludur.")]
        public string ContactClient { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dosya konusu zorunludur.")]
        public string FileSubject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Sorumlu kişi bilgisi zorunludur.")]
        public string CaseResponsible { get; set; } = string.Empty;

        [Required(ErrorMessage = "Görevin niteliği zorunludur.")]
        public string PrmNatureOfAssignment { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kullanım yeri konusu zorunludur.")]
        public string PrmCasePlaceofUseSubject { get; set; } = string.Empty;

        [Required(ErrorMessage = "Konu açıklaması zorunludur.")]
        public string SubjectMatterDescription { get; set; } = string.Empty;

        [Required(ErrorMessage = "Faturalandırma durumu zorunludur.")]
        public bool IsToBeInvoiced { get; set; } = false;

        [Required(ErrorMessage = "Şehir bilgisi zorunludur.")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur.")]
        public string Description { get; set; } = string.Empty;

        // === Opsiyonel Alanlar (mevcut) ===
        public string? Country { get; set; }
        public string? County { get; set; }
        public string? Address { get; set; }
        public string? Attorney1 { get; set; }
        public string? Attorney2 { get; set; }
        public string? Attorney3 { get; set; }

        // === Yeni title alanları (tamamı opsiyonel) ===
        public int? FileCaseViewId { get; set; }
        public int? FileCaseId { get; set; }
        public bool? IsOfficeFile { get; set; }
        public bool? IsPrivateFile { get; set; }
        public bool? IsProposalFile { get; set; }
        public int? ContactClientId { get; set; }
        public int? ContactIntermadiaryCompanyId { get; set; }
        public string? ContactCounter { get; set; }
        public string? FileNo { get; set; }
        public string? PrmStatus { get; set; }
        public string? PrmPriority { get; set; }
        public string? TariffType { get; set; }
        public DateTime? FileOpenDate { get; set; }
        public DateTime? FileCloseDate { get; set; }
        public string? CourtAuthorityReferenceNo { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? FileType { get; set; }
        public string? FileTypeValue { get; set; }
        public string? FileStatus { get; set; }
        public string? HardCopyLocation { get; set; }
        public int? GlobalSystemCustomerId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? LastModifiedDate { get; set; }
        public string? LastModifiedGlobalUser { get; set; }
        public int? OrganizationEmployeeId { get; set; }
        public string? PrmStatusTypeValue { get; set; }
        public string? FileCaseReferenceNo { get; set; }
        public string? AuthorList { get; set; }
        public string? ReaderList { get; set; }
        public int? ContactCounterId { get; set; }
        public int? FileSubjectId { get; set; }
        public int? PrmStatusId { get; set; }
        public int? PrmPriorityId { get; set; }
        public int? TariffTypeId { get; set; }

        // — WorkingGroup standardı (Lawyer ile aynı isimlendirme) —
        public int? WorkingGroupId { get; set; }

        public int? FileTypeId { get; set; }
        public int? FileStatusId { get; set; }
        public int? HardCopyLocationId { get; set; }
        public int? LastModifiedGlobalUserId { get; set; }
        public string? HardCopyLocationDesc { get; set; }
        public string? ClientReferenceNo { get; set; }
        public string? OACasePartner { get; set; }
        public string? Supervisor { get; set; }
        public string? ContactCourt { get; set; }
        public int? ContactCourtHouseId { get; set; }
        public string? ContactCourtLocation { get; set; }
        public int? ContactLocationCourtId { get; set; }
        public int? PrmNatureOfAssignmentId { get; set; }
        public string? Note { get; set; }
        public bool? IsDemoRecord { get; set; }
        public int? FinanceContactAccountId { get; set; }
        public string? CreateBy { get; set; }

        // Concurrency için
        public byte[]? RowVersion { get; set; }
    }
}
