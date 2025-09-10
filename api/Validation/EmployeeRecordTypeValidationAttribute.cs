using System.ComponentModel.DataAnnotations;
using dava_avukat_eslestirme_asistani.Constants;

namespace dava_avukat_eslestirme_asistani.Validation
{
    public class EmployeeRecordTypeValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return ValidationResult.Success; // Boş değer geçerli

            var recordType = value.ToString()!;
            
            if (WorkGroupConstants.ValidEmployeeRecordTypes.Contains(recordType))
                return ValidationResult.Success;

            return new ValidationResult(
                "Geçersiz personel kayıt tipi. Geçerli değerler: FullTime, Intern, Contractor, External.",
                new[] { validationContext.MemberName ?? "PrmEmployeeRecordType" }
            );
        }
    }
}
