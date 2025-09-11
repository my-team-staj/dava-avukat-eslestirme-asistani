namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerQueryParameters
    {
        public string? City { get; set; }
        public bool? IsActive { get; set; }
        public string? SearchTerm { get; set; }

        // İsteğe bağlı ek filtreler (ileride kullanılabilir)
        public string? Title { get; set; }
        public string? Languages { get; set; }

        // Sayfalama
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sıralama
        // Geçerli değerler: fullname, city, title, startdate
        public string? SortBy { get; set; } = "FullName";
        public string? SortOrder { get; set; } = "asc"; // asc | desc
    }
}
