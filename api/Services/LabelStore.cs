using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using ClosedXML.Excel;
using Microsoft.Extensions.Configuration;

namespace dava_avukat_eslestirme_asistani.Services
{
    public interface ILabelStore
    {
        // caseId -> (label listesi, sıralı/tekrarsız)
        IReadOnlyDictionary<int, List<int>> GetAll();
        bool TryGet(int caseId, out List<int> labels);
        void Reload();
    }

    public sealed class ExcelLabelStore : ILabelStore
    {
        private readonly IConfiguration _cfg;
        private readonly object _gate = new();
        private Dictionary<int, List<int>> _labels = new();

        public ExcelLabelStore(IConfiguration cfg)
        {
            _cfg = cfg;
            Reload();
        }

        public IReadOnlyDictionary<int, List<int>> GetAll() => _labels;

        public bool TryGet(int caseId, out List<int> labels) => _labels.TryGetValue(caseId, out labels!);

        public void Reload()
        {
            var path = _cfg["Labels:Path"];
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                lock (_gate) { _labels = new(); }
                return;
            }

            var ext = Path.GetExtension(path).ToLowerInvariant();
            if (ext == ".xlsx")
                LoadFromXlsx(path, _cfg["Labels:Sheet"] ?? "Labels");
            else if (ext == ".csv")
                LoadFromCsv(path);
            else
                throw new InvalidOperationException($"Etiket dosya uzantısı desteklenmiyor: {ext}");
        }

        private static List<int> DedupKeepOrder(IEnumerable<int> seq)
        {
            var seen = new HashSet<int>();
            var outp = new List<int>();
            foreach (var x in seq)
                if (seen.Add(x)) outp.Add(x);
            return outp;
        }

        private void LoadFromXlsx(string path, string sheet)
        {
            var required = new[] { "case_id", "label_1", "label_2", "label_3", "label_4", "label_5" };
            var tmp = new Dictionary<int, List<int>>();

            using var wb = new XLWorkbook(path);
            var ws = wb.Worksheet(sheet);
            var table = ws.RangeUsed().AsTable();
            var cols = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            int ci = 1;
            foreach (var c in table.HeadersRow().Cells())
            {
                cols[c.GetString().Trim()] = ci++;
            }
            foreach (var need in required)
                if (!cols.ContainsKey(need))
                    throw new InvalidOperationException($"Eksik kolon: {need}");

            foreach (var row in table.DataRange.Rows())
            {
                if (!int.TryParse(row.Field(cols["case_id"]).GetString(), NumberStyles.Any, CultureInfo.InvariantCulture, out var caseId))
                    continue;

                var labels = new List<int>();
                for (int i = 1; i <= 5; i++)
                {
                    var cell = row.Field(cols[$"label_{i}"]).GetString();
                    if (int.TryParse(cell, NumberStyles.Any, CultureInfo.InvariantCulture, out var lid))
                        labels.Add(lid);
                }
                tmp[caseId] = DedupKeepOrder(labels);
            }

            lock (_gate) { _labels = tmp; }
        }

        private void LoadFromCsv(string path)
        {
            var lines = File.ReadAllLines(path);
            if (lines.Length == 0) { lock (_gate) { _labels = new(); } return; }

            var header = lines[0].Split(',');
            var idx = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            for (int i = 0; i < header.Length; i++) idx[header[i].Trim()] = i;

            string[] req = { "case_id", "label_1", "label_2", "label_3", "label_4", "label_5" };
            foreach (var need in req) if (!idx.ContainsKey(need)) throw new InvalidOperationException($"Eksik kolon: {need}");

            var tmp = new Dictionary<int, List<int>>();
            for (int r = 1; r < lines.Length; r++)
            {
                var parts = lines[r].Split(',');
                if (parts.Length < header.Length) continue;
                if (!int.TryParse(parts[idx["case_id"]], out var caseId)) continue;

                var labels = new List<int>();
                for (int i = 1; i <= 5; i++)
                {
                    if (int.TryParse(parts[idx[$"label_{i}"]], out var lid))
                        labels.Add(lid);
                }
                tmp[caseId] = DedupKeepOrder(labels);
            }

            lock (_gate) { _labels = tmp; }
        }
    }
}
