namespace dava_avukat_eslestirme_asistani.DTOs
{
    public class LawyerQueryParameters
    {
        public string? City { get; set; }
        public bool? IsActive { get; set; }
        public bool? AvailableForProBono { get; set; }

        // Sayfalama
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        // Sıralama
        public string? SortBy { get; set; } = "Name"; // name, rating vb.
        public string? SortOrder { get; set; } = "asc"; // asc | desc
    }
}
