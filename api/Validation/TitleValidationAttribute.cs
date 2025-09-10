using System.ComponentModel.DataAnnotations;
using dava_avukat_eslestirme_asistani.Constants;

namespace dava_avukat_eslestirme_asistani.Validation
{
    public class TitleValidationAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return ValidationResult.Success; // Boş değer geçerli

            var title = value.ToString()!;
            
            if (WorkGroupConstants.ValidTitles.Contains(title))
                return ValidationResult.Success;

            return new ValidationResult(
                "Geçersiz unvan. Geçerli değerler: A1, A2, Stajyer Avukat, Yaz Stajyeri.",
                new[] { validationContext.MemberName ?? "Title" }
            );
        }
    }
}
