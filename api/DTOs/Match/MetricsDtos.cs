// DTOs/Match/MetricsDtos.cs
namespace dava_avukat_eslestirme_asistani.DTOs.Match
{
    public sealed class MetricsDto
    {
        public double PrecisionAtK { get; set; }
        public double RecallAtK { get; set; }
        public double F1AtK { get; set; }
    }
}
