using System.ComponentModel.DataAnnotations;
using dava_avukat_eslestirme_asistani.Constants;

namespace dava_avukat_eslestirme_asistani.Validation
{
    public class WorkGroupValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return ValidationResult.Success; // Boş değer geçerli

            var workGroup = value.ToString()!;
            
            if (WorkGroupConstants.ValidWorkGroups.Contains(workGroup))
                return ValidationResult.Success;

            return new ValidationResult(
                "Geçersiz çalışma grubu. Geçerli değerler: PATENT, ARAŞTIRMA, FM TAKLİTLE MÜCADELE, MARKA, TELİF, TASARIM, ŞİRKETLER ve SÖZLEŞMELER, TESCİL, TİCARİ DAVA.",
                new[] { validationContext.MemberName ?? "WorkGroup" }
            );
        }
    }
}
