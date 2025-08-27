// Services/MetricsService.cs
namespace dava_avukat_eslestirme_asistani.Services;

public static class MetricsService
{
    public sealed record Result(double PrecisionAtK, double RecallAtK, double F1AtK);

    public static Result ComputeAtK(IEnumerable<int> predictedIds, int[] gold, int k)
    {
        var predTopK = predictedIds.Distinct().Take(k).ToArray();
        if (predTopK.Length == 0 || gold.Length == 0)
            return new Result(0, 0, 0);

        var goldSet = gold.ToHashSet();
        int tp = predTopK.Count(id => goldSet.Contains(id));

        double p = tp / (double)predTopK.Length;
        double r = tp / (double)gold.Length;
        double f1 = (p + r) == 0 ? 0 : 2 * p * r / (p + r);
        return new Result(Math.Round(p, 6), Math.Round(r, 6), Math.Round(f1, 6));
    }
}
