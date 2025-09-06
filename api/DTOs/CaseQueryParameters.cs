namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseQueryParameters
    {
        public string? City { get; set; }
        public string? Language { get; set; }
        public string? UrgencyLevel { get; set; }
        public bool? IsActive { get; set; }
        public bool? RequiresProBono { get; set; }
        public string? SearchTerm { get; set; }

        // Sayfalama
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sıralama
        public string? SortBy { get; set; } = "FiledDate";
        public string? SortOrder { get; set; } = "desc"; // asc | desc
    }
}
