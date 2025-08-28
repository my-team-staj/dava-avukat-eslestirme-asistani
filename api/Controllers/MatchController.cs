using Microsoft.AspNetCore.Mvc;
using dava_avukat_eslestirme_asistani.DTOs.Match;
using dava_avukat_eslestirme_asistani.Services;
using System.Globalization;
using ClosedXML.Excel;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using System;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly CandidateQueryService _cq;
        private readonly LlmMatchService _llm;
        private readonly IConfiguration _cfg;

        // Bellekte etiketler: caseId -> [lawyer1..lawyer5] (sıralı)
        private static readonly object _labelsGate = new();
        private static Dictionary<int, List<int>> _LABELS = new();
        private static bool _labelsLoaded = false;

        public MatchController(CandidateQueryService cq, LlmMatchService llm, IConfiguration cfg)
        {
            _cq = cq; _llm = llm; _cfg = cfg;
        }

        /// <summary>
        /// Dava için en uygun avukatları önerir
        /// </summary>
        /// <param name="req">Eşleştirme isteği parametreleri</param>
        /// <returns>Eşleştirilen avukat listesi ve (varsa) metrikler</returns>
        /// <response code="200">Başarılı eşleştirme sonucu</response>
        /// <response code="400">Geçersiz istek</response>
        /// <response code="500">Sunucu hatası</response>
        [HttpPost("suggest")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Suggest([FromBody] MatchRequest req, CancellationToken ct = default)
        {
            var requestedTopK = req.TopK <= 0 ? 5 : req.TopK;

            // Case + aday havuzu
            var (caseSum, candidates) = await _cq.BuildAsync(req.CaseId, take: 30);
            if (caseSum == null || candidates.Count == 0)
            {
                return Ok(new
                {
                    caseId = req.CaseId,
                    candidates = new List<MatchCandidate>(),
                    metrics = (object?)null
                });
            }

            // LLM skorlama
            var picks = await _llm.SuggestAsync(caseSum, candidates, requestedTopK);

            // Metrikler
            EnsureLabelsLoaded();
            object? metricsObj = null;
            if (_LABELS.TryGetValue(caseSum.Id, out var truth) && truth.Count > 0 && picks.Count > 0)
            {
                var predIds = picks.Select(p => p.LawyerId).ToList();
                var kEff = Math.Min(5, Math.Max(1, predIds.Count));
                var m = ComputeCaseMetrics(caseSum.Id, predIds, truth, kEff);

                metricsObj = new
                {
                    k = m.k,
                    precision_at_k = m.precision_at_k,
                    recall_at_k = m.recall_at_k,
                    f1_at_k = m.f1_at_k
                };
            }

            return Ok(new
            {
                caseId = caseSum.Id,
                candidates = picks,
                metrics = metricsObj
            });
        }

        // =========================
        // 2) KULLANICI SEÇİMİ KAYDET
        // =========================
        public sealed class ChooseRequest
        {
            public int CaseId { get; set; }
            public int LawyerId { get; set; }
            public string? ChosenBy { get; set; } // opsiyonel
        }

        [HttpPost("choose")]
        public async Task<IActionResult> Choose([FromBody] ChooseRequest req)
        {
            if (req.CaseId <= 0 || req.LawyerId <= 0)
                return BadRequest("CaseId ve LawyerId zorunludur.");

            // Basit doğrulama: seçilen avukat gerçekten bu davanın aday havuzunda mı?
            var (caseSum, candidates) = await _cq.BuildAsync(req.CaseId, take: 50);
            if (caseSum == null) return NotFound("Dava bulunamadı.");
            if (!candidates.Any(c => c.Id == req.LawyerId))
                return BadRequest("Seçilen lawyerId bu dava için aday havuzunda değil.");

            var cs = GetConnectionString(_cfg);
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Veritabanı bağlantı dizesi bulunamadı (ConnectionStrings).");

            await EnsureChoiceTableAsync(cs);

            // Tek seçim politikası: önce eski kaydı sil, sonra yeni kaydı ekle
            const string deleteSql = "DELETE FROM dbo.CaseLawyerChoice WHERE CaseId = @CaseId;";
            const string insertSql = @"
INSERT INTO dbo.CaseLawyerChoice (CaseId, LawyerId, ChosenAt, ChosenBy)
VALUES (@CaseId, @LawyerId, SYSUTCDATETIME(), @ChosenBy);";

            using var con = new SqlConnection(cs);
            await con.OpenAsync();
            using var tx = await con.BeginTransactionAsync();

            try
            {
                using (var del = new SqlCommand(deleteSql, con, (SqlTransaction)tx))
                {
                    del.Parameters.Add(new SqlParameter("@CaseId", SqlDbType.Int) { Value = req.CaseId });
                    await del.ExecuteNonQueryAsync();
                }

                using (var ins = new SqlCommand(insertSql, con, (SqlTransaction)tx))
                {
                    ins.Parameters.Add(new SqlParameter("@CaseId", SqlDbType.Int) { Value = req.CaseId });
                    ins.Parameters.Add(new SqlParameter("@LawyerId", SqlDbType.Int) { Value = req.LawyerId });
                    ins.Parameters.Add(new SqlParameter("@ChosenBy", SqlDbType.NVarChar, 100)
                    {
                        Value = (object?)req.ChosenBy ?? DBNull.Value
                    });
                    await ins.ExecuteNonQueryAsync();
                }

                await tx.CommitAsync();
            }
            catch
            {
                await tx.RollbackAsync();
                throw;
            }

            return Ok(new { caseId = req.CaseId, lawyerId = req.LawyerId, saved = true });
        }

        // =========================
        // 3) KAYITLARI LİSTELE
        // =========================
        public sealed class ChoiceDto
        {
            public int Id { get; set; }
            public int CaseId { get; set; }
            public int LawyerId { get; set; }
            public DateTime ChosenAt { get; set; }
            public string? ChosenBy { get; set; }
        }

        /// <summary>
        /// Tüm eşleşme kayıtlarını listeler. İsterseniz ?caseId= ile filtreleyin.
        /// </summary>
        [HttpGet("choices")]
        public async Task<ActionResult<IEnumerable<ChoiceDto>>> ListChoices([FromQuery] int? caseId = null)
        {
            var cs = GetConnectionString(_cfg);
            if (string.IsNullOrWhiteSpace(cs))
                return Problem("Veritabanı bağlantı dizesi bulunamadı (ConnectionStrings).");

            await EnsureChoiceTableAsync(cs);

            var list = new List<ChoiceDto>();
            string sql = @"SELECT Id, CaseId, LawyerId, ChosenAt, ChosenBy
                           FROM dbo.CaseLawyerChoice";
            if (caseId.HasValue) sql += " WHERE CaseId = @CaseId";
            sql += " ORDER BY ChosenAt DESC";

            using var con = new SqlConnection(cs);
            await con.OpenAsync();
            using var cmd = new SqlCommand(sql, con);
            if (caseId.HasValue)
                cmd.Parameters.Add(new SqlParameter("@CaseId", SqlDbType.Int) { Value = caseId.Value });

            using var rd = await cmd.ExecuteReaderAsync();
            while (await rd.ReadAsync())
            {
                list.Add(new ChoiceDto
                {
                    Id = rd.GetInt32(0),
                    CaseId = rd.GetInt32(1),
                    LawyerId = rd.GetInt32(2),
                    ChosenAt = rd.GetDateTime(3),
                    ChosenBy = rd.IsDBNull(4) ? null : rd.GetString(4)
                });
            }

            return Ok(list);
        }

        // =========================
        // 4) LABELS YENİDEN YÜKLE (opsiyonel)
        // =========================
        [HttpPost("_reload_labels")]
        public IActionResult ReloadLabels()
        {
            lock (_labelsGate)
            {
                var relPath = _cfg["Labels:Path"];
                var sheet = _cfg["Labels:Sheet"] ?? "Labels";
                string? lastError = null;

                try
                {
                    var path = ResolvePath(relPath);
                    _LABELS = LoadLabels(path, sheet);
                    _labelsLoaded = true;
                }
                catch (Exception ex)
                {
                    _LABELS = new();
                    _labelsLoaded = false;
                    lastError = ex.Message;
                }

                return Ok(new
                {
                    loaded = _LABELS.Count,
                    lastPath = relPath,
                    lastSheet = sheet,
                    lastError,
                    sample = _LABELS.Take(3)
                        .Select(kv => new { case_id = kv.Key, labels = kv.Value })
                        .ToList()
                });
            }
        }

        // ---- METRİK HELPER’LARI ----
        private sealed class CaseMetrics
        {
            public int case_id { get; set; }
            public int k { get; set; }
            public double precision_at_k { get; set; }
            public double recall_at_k { get; set; }
            public double f1_at_k { get; set; }
        }

        private static CaseMetrics ComputeCaseMetrics(int caseId, List<int> predictedIds, List<int> truthList, int k)
        {
            var truthSet = truthList.ToHashSet();
            var topk = DedupKeepOrder(predictedIds).Take(k).ToList();

            var hit = topk.Count(x => truthSet.Contains(x));
            var p = topk.Count > 0 ? (double)hit / topk.Count : 0.0;
            var r = truthSet.Count > 0 ? (double)hit / truthSet.Count : 0.0;
            var f1 = (p + r) == 0 ? 0.0 : 2 * p * r / (p + r);

            return new CaseMetrics
            {
                case_id = caseId,
                k = k,
                precision_at_k = Math.Round(p, 6, MidpointRounding.AwayFromZero),
                recall_at_k = Math.Round(r, 6, MidpointRounding.AwayFromZero),
                f1_at_k = Math.Round(f1, 6, MidpointRounding.AwayFromZero)
            };
        }

        private void EnsureLabelsLoaded()
        {
            if (_labelsLoaded) return;
            lock (_labelsGate)
            {
                if (_labelsLoaded) return;

                var relPath = _cfg["Labels:Path"];
                var sheet = _cfg["Labels:Sheet"] ?? "Labels";
                var path = ResolvePath(relPath);

                _LABELS = LoadLabels(path, sheet);
                _labelsLoaded = true;
            }
        }

        private static string? ResolvePath(string? relOrAbs)
        {
            if (string.IsNullOrWhiteSpace(relOrAbs)) return relOrAbs;
            if (Path.IsPathRooted(relOrAbs)) return relOrAbs;
            var baseDir = Directory.GetCurrentDirectory();
            return Path.GetFullPath(Path.Combine(baseDir, relOrAbs));
        }

        private static Dictionary<int, List<int>> LoadLabels(string? path, string sheet)
        {
            var dict = new Dictionary<int, List<int>>();
            if (string.IsNullOrWhiteSpace(path) || !System.IO.File.Exists(path))
                return dict;

            var ext = Path.GetExtension(path).ToLowerInvariant();
            if (ext == ".xlsx")
                return LoadFromXlsx(path!, sheet);
            if (ext == ".csv")
                return LoadFromCsv(path!);

            return dict;
        }

        // XLSX okuma (hücre bazlı; başlık->sütun eşlemesi)
        private static Dictionary<int, List<int>> LoadFromXlsx(string path, string sheet)
        {
            var required = new[] { "case_id", "label_1", "label_2", "label_3", "label_4", "label_5" };
            var res = new Dictionary<int, List<int>>();

            using var wb = new XLWorkbook(path);
            var ws = wb.Worksheet(sheet);

            var used = ws.RangeUsed();
            if (used == null) return res;

            int headerRow = used.RangeAddress.FirstAddress.RowNumber;
            int firstCol = used.RangeAddress.FirstAddress.ColumnNumber;
            int lastCol = used.RangeAddress.LastAddress.ColumnNumber;
            int lastRow = used.RangeAddress.LastAddress.RowNumber;

            var cols = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            for (int c = firstCol; c <= lastCol; c++)
            {
                var name = ws.Cell(headerRow, c).GetString().Trim();
                if (!string.IsNullOrEmpty(name))
                    cols[name] = c;
            }

            foreach (var need in required)
                if (!cols.ContainsKey(need))
                    throw new InvalidOperationException($"Eksik kolon: {need}");

            for (int r = headerRow + 1; r <= lastRow; r++)
            {
                var caseText = ws.Cell(r, cols["case_id"]).GetString().Trim();
                if (!int.TryParse(caseText, NumberStyles.Any, CultureInfo.InvariantCulture, out var caseId))
                    continue;

                var labels = new List<int>();
                for (int i = 1; i <= 5; i++)
                {
                    var s = ws.Cell(r, cols[$"label_{i}"]).GetString().Trim();
                    if (int.TryParse(s, NumberStyles.Any, CultureInfo.InvariantCulture, out var lid))
                        labels.Add(lid);
                }
                res[caseId] = DedupKeepOrder(labels);
            }

            return res;
        }

        private static Dictionary<int, List<int>> LoadFromCsv(string path)
        {
            var res = new Dictionary<int, List<int>>();
            var lines = System.IO.File.ReadAllLines(path);
            if (lines.Length == 0) return res;

            var header = lines[0].Split(',');
            var idx = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            for (int i = 0; i < header.Length; i++) idx[header[i].Trim()] = i;

            string[] req = { "case_id", "label_1", "label_2", "label_3", "label_4", "label_5" };
            foreach (var need in req)
                if (!idx.ContainsKey(need))
                    throw new InvalidOperationException($"Eksik kolon: {need}");

            for (int r = 1; r < lines.Length; r++)
            {
                var parts = lines[r].Split(',');
                if (parts.Length < header.Length) continue;

                if (!int.TryParse(parts[idx["case_id"]].Trim(), out var caseId))
                    continue;

                var labels = new List<int>();
                for (int i = 1; i <= 5; i++)
                {
                    var cell = parts[idx[$"label_{i}"]].Trim();
                    if (int.TryParse(cell, out var lid))
                        labels.Add(lid);
                }

                res[caseId] = DedupKeepOrder(labels);
            }
            return res;
        }

        private static List<int> DedupKeepOrder(IEnumerable<int> seq)
        {
            var seen = new HashSet<int>();
            var outp = new List<int>();
            foreach (var x in seq)
                if (seen.Add(x)) outp.Add(x);
            return outp;
        }

        // Basit key sağlık kontrolü
        [HttpGet("_checkKey")]
        public ActionResult<object> CheckKey([FromServices] IConfiguration cfg)
        {
            var k = cfg["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            if (string.IsNullOrWhiteSpace(k)) return Problem("Key yok.");
            return Ok(new { ok = true, source = cfg["OpenAI:ApiKey"] != null ? "secrets" : "env", len = k.Length });
        }

        // =========================
        // DB yardımcıları
        // =========================
        private static string? GetConnectionString(IConfiguration cfg)
        {
            return cfg.GetConnectionString("DefaultConnection")
                ?? cfg.GetConnectionString("sqlConnection")
                ?? cfg.GetConnectionString("Main")
                ?? cfg.GetConnectionString("Db")
                ?? cfg["ConnectionStrings:DefaultConnection"]
                ?? cfg["ConnectionStrings:sqlConnection"]
                ?? cfg["ConnectionStrings:Main"]
                ?? cfg["ConnectionStrings:Db"];
        }

        private static async Task EnsureChoiceTableAsync(string connString)
        {
            const string sql = @"
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CaseLawyerChoice]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[CaseLawyerChoice](
        [Id]        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [CaseId]    INT NOT NULL,
        [LawyerId]  INT NOT NULL,
        [ChosenAt]  DATETIME2 NOT NULL CONSTRAINT DF_CaseLawyerChoice_ChosenAt DEFAULT SYSUTCDATETIME(),
        [ChosenBy]  NVARCHAR(100) NULL
    );
    CREATE INDEX IX_CaseLawyerChoice_CaseId ON [dbo].[CaseLawyerChoice]([CaseId]);
END";
            using var con = new SqlConnection(connString);
            await con.OpenAsync();
            using var cmd = new SqlCommand(sql, con);
            await cmd.ExecuteNonQueryAsync();
        }
    }
}
