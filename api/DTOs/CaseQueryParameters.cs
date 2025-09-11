namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class CaseQueryParameters
    {
        // Filtreleme
        public string? City { get; set; }
        public string? FileSubject { get; set; }
        public string? CaseResponsible { get; set; }
        public string? ContactClient { get; set; }
        public bool? IsToBeInvoiced { get; set; }
        public string? SearchTerm { get; set; }

        // Sayfalama
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sıralama
        public string? SortBy { get; set; } = "FileSubject";
        public string? SortOrder { get; set; } = "desc"; // asc | desc
    }
}
