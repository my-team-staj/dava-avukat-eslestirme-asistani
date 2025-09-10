namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerQueryParameters
    {
        public string? City { get; set; }
        public bool? IsActive { get; set; }
        public string? WorkGroup { get; set; }
        public string? SearchTerm { get; set; }

        // Sayfalama
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sıralama
        public string? SortBy { get; set; } = "FullName"; // FullName, StartDate vb.
        public string? SortOrder { get; set; } = "asc"; // asc | desc
    }
}
