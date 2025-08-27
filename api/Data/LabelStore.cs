// Data/LabelStore.cs
using ClosedXML.Excel;

namespace dava_avukat_eslestirme_asistani.Data;

public static class LabelStore
{
    // caseId -> en fazla 5 etiket
    private static readonly Dictionary<int, int[]> _labels = new();

    public static IReadOnlyDictionary<int, int[]> All => _labels;

    public static void LoadFromExcel(string path, string sheetName = "Labels")
    {
        _labels.Clear();
        using var wb = new XLWorkbook(path);
        var ws = wb.Worksheets.Worksheet(sheetName);

        // Başlıklar: case_id, label_1..label_5
        var firstRow = ws.FirstRowUsed().RowNumber();
        var lastRow = ws.LastRowUsed().RowNumber();

        var headers = ws.Row(firstRow).CellsUsed().Select(c => c.GetString().Trim().ToLower()).ToList();
        string[] required = ["case_id", "label_1", "label_2", "label_3", "label_4", "label_5"];
        if (!required.All(h => headers.Contains(h)))
            throw new InvalidOperationException("Labels sayfasında beklenen başlıklar yok.");

        int idx(string name) => headers.FindIndex(h => h == name) + 1;

        for (int r = firstRow + 1; r <= lastRow; r++)
        {
            var row = ws.Row(r);
            if (row.Cell(idx("case_id")).IsEmpty()) continue;

            int caseId = row.Cell(idx("case_id")).GetValue<int>();
            var vals = new List<int>();
            foreach (var h in required.Skip(1))
            {
                var cell = row.Cell(idx(h));
                if (!cell.IsEmpty())
                    vals.Add(cell.GetValue<int>());
            }
            // tekrarsız & max 5
            var arr = vals.Distinct().Take(5).ToArray();
            if (arr.Length > 0) _labels[caseId] = arr;
        }
    }

    public static int[]? ForCase(int caseId) => _labels.TryGetValue(caseId, out var v) ? v : null;
}
