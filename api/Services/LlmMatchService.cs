using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using dava_avukat_eslestirme_asistani.DTOs.Match;
using Microsoft.Extensions.Configuration;

namespace dava_avukat_eslestirme_asistani.Services
{
    public class LlmMatchService
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _cfg;

        public LlmMatchService(HttpClient http, IConfiguration cfg)
        {
            _http = http;
            _cfg = cfg;
        }

        public async Task<List<MatchCandidate>> SuggestAsync(
            CaseSummary caseSum, List<LawyerCard> candidates, int topK, string? modelOverride = null)
        {
            // 1) API key & model
            var apiKey = _cfg["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("OpenAI API key bulunamadı. User Secrets veya ENV ile verin.");

            var model = modelOverride ?? (_cfg["OpenAI:Model"] ?? "gpt-4o-mini");
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            // 2) Prompt helper
            string One(string? s) => (s ?? string.Empty).Replace("\r", " ").Replace("\n", " ").Trim();

            // --- Title skorları ---
            var titleScoresJson = @"
{
  ""Professor"": 95,
  ""Direktör"": 92,
  ""Araştırma Direktörü"": 92,
  ""OAD"": 92,
  ""OAG"": 92,
  ""Ünite Yöneticisi Asistan"": 92,

  ""Counsel"": 88,
  ""Kıdemli Vekil"": 88,
  ""Kıdemli Araştırmacı"": 88,
  ""Lider Araştırmacı"": 88,

  ""Avukat"": 82,
  ""Danışman Avukat"": 82,
  ""Vekil"": 82,

  ""Araştırmacı"": 75,
  ""Araştırma"": 75,
  ""Araştırma Asistanı"": 75,
  ""OA4"": 75,
  ""YA"": 75,

  ""Asistan"": 68,
  ""Tercüman"": 68,
  ""Tescil Asistanı"": 68,

  ""Tescil Asistanı Destek Sorumlusu"": 62,
  ""Yardımcı Vekil"": 62,
  ""OA3"": 62,

  ""A3"": 58,
  ""OA2"": 58,

  ""A2"": 52,
  ""OA1"": 52,

  ""A1"": 48,
  ""A0"": 45,

  ""Stajyer Avukat"": 30,
  ""TOBB Stajyeri"": 30,
  ""Yaz Stajyeri"": 30,
  ""Dönemsel Stajyer"": 30
}";

            // --- Sistem mesajı ---
            var sys =
                "Sen bir dava–avukat eşleştirme asistanısın.\n" +
                "- SADECE verilen avukat listesinden seç; listede olmayanı yazma.\n" +
                "- Zorunlu uyum: ŞEHİR (Case.City ≡ Lawyer.City). Uymayan adayı ele.\n" +
                "- Değerlendirme sinyalleri ve önerilen ağırlıklar:\n" +
                "  • Deneyim yılı (0.50)\n" +
                "  • WorkingGroup + Title uyumu (0.30) – WG eşleşmesi bonus; unvanı title_scores ile değerlendir.\n" +
                "  • Metinsel açıklama uyumu (0.20)\n" +
                "- Notlar: IsActive=false hafif eksi etki; Languages/Education/RecordType ek bağlamdır.\n" +
                "- ÇIKIŞ ŞEMASI: {\"candidates\":[{\"lawyerId\":number,\"score\":number,\"reason\":string}]}\n" +
                "- score: 0–1 arası; 1.00 verme, yuvarlak skorlardan kaçın.\n" +
                "- reason: Kurumsal ve kısa (1–2 cümle, ~200 karakter). Şehir uyumu ve güçlü taraf(lar) net yazılsın; 'ama/ancak/fakat/lakin/yalnız' kelimeleri kesinlikle kullanılmasın.\n" +
                "- Yalnızca geçerli JSON döndür; JSON dışına yazma.";

            // --- CASE bloğu ---
            var caseBlock = $@"
# CASE
id={caseSum.Id};
fileSubject={One(caseSum.FileSubject)};
natureOfAssignment={One(caseSum.PrmNatureOfAssignment)};
placeOfUseSubject={One(caseSum.PrmCasePlaceofUseSubject)};
subjectMatterDescription={One(caseSum.SubjectMatterDescription)};
isToBeInvoiced={(caseSum.IsToBeInvoiced ? "true" : "false")};
city={One(caseSum.City)};
description={One(caseSum.Description)};
workingGroupId={(caseSum.WorkingGroupId.HasValue ? caseSum.WorkingGroupId.Value.ToString() : "null")};
workingGroupName={One(caseSum.WorkingGroupName)};";

            // --- CANDIDATES bloğu ---
            var candsBlock = string.Join("\n", candidates.Select(c =>
            {
                var start = c.StartDate.HasValue ? c.StartDate.Value.ToString("yyyy-MM-dd") : "null";
                var langs = string.Join(",", (c.Languages ?? Array.Empty<string>()).Select(One));
                return
                    $"- id={c.Id}; city={One(c.City)}; " +
                    $"expYears={c.ExperienceYears}; startDate={start}; " +
                    $"isActive={(c.IsActive ? "true" : "false")}; " +
                    $"langs=[{langs}]; title={One(c.Title)}; education={One(c.Education)}; " +
                    $"recordType={One(c.PrmEmployeeRecordType)}; workGroupId={c.WorkGroupId}; workGroup={One(c.WorkGroup)};";
            }));

            var user = $@"
{caseBlock}

# CANDIDATES (choose top {topK})
{candsBlock}

# INSTRUCTIONS
- Zorunlu kural: CITY uyuşmalı. Uyuşmayan adayı ele.
- WorkingGroup filtre değil; eşleşirse skora bonus uygula.
- Title puanını title_scores ile değerlendir.
- reasons: Kurumsal, pozitif, 1–2 cümle; şehir uyumu + güçlü yan(lar). 'ama/ancak/fakat/lakin/yalnız' kelimeleri kesinlikle yasak.
- En iyi {topK} adayı JSON üret.";

            // 3) Chat Completions (JSON-only)
            var body = new
            {
                model,
                temperature = 0.2,
                response_format = new { type = "json_object" },
                messages = new object[]
                {
                    new { role = "system", content = sys },
                    new { role = "user", content = user }
                }
            };

            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
            {
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            };

            var res = await _http.SendAsync(req);
            res.EnsureSuccessStatusCode();

            using var stream = await res.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);

            var content = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "{}";

            if (string.IsNullOrWhiteSpace(content) || !content.TrimStart().StartsWith("{"))
                throw new InvalidOperationException("LLM JSON parse failed. İçerik JSON değil.");

            var parsed = JsonSerializer.Deserialize<CompletionShape>(content,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                ?? new CompletionShape();

            // 4) Sadece verilen adaylardan gelenleri al; tekrarları engelle
            var allowed = candidates.Select(c => c.Id).ToHashSet();
            var seen = new HashSet<int>();
            var raw = new List<MatchCandidate>();
            foreach (var x in (parsed.Candidates ?? Enumerable.Empty<MatchCandidate>()))
            {
                if (!allowed.Contains(x.LawyerId)) continue;
                if (seen.Add(x.LawyerId))
                {
                    var reason = CleanReason(x.Reason ?? string.Empty);
                    raw.Add(new MatchCandidate(x.LawyerId, Clamp01(x.Score), reason));
                }
            }
            if (raw.Count == 0) return new List<MatchCandidate>();

            // 5) Kalibrasyon
            var calibrated = raw
                .Select(x =>
                {
                    var baseScore = MonoMap(x.Score);
                    var s = Clamp(baseScore + Jitter(caseSum.Id, x.LawyerId), 0.0, 0.96);
                    s = Math.Round(s, 2);

                    var reason = CleanReason(x.Reason ?? string.Empty);
                    if (reason.Length > 220) reason = reason.Substring(0, 220);

                    return new MatchCandidate(x.LawyerId, s, reason);
                })
                .OrderByDescending(x => x.Score)
                .Take(topK)
                .ToList();

            return calibrated;
        }

        // --- Helpers ---
        private static double Clamp01(double v) => v < 0 ? 0 : (v > 1 ? 1 : v);
        private static double Clamp(double v, double lo, double hi) => v < lo ? lo : (v > hi ? hi : v);

        private static double MonoMap(double s)
        {
            s = Clamp01(s);
            var p = 1.0 / (1.0 + Math.Exp(-(s - 0.5) / 0.22)); // 0..1
            return 0.40 + 0.56 * p; // 0.40..0.96
        }

        private static double Jitter(int caseId, int lawyerId)
        {
            unchecked
            {
                int h = 17;
                h = h * 31 + caseId;
                h = h * 31 + lawyerId;
                double r = ((h & 0x7fffffff) % 1000) / 1000.0; // 0..1
                return (r - 0.5) * 0.02; // -0.01 .. +0.01
            }
        }

        /// <summary>
        /// Yasaklı bağlaçları (ama/ancak/fakat/lakin/yalnız + 'amcak' typo) metnin her yerinden söker,
        /// artıkları toparlar, son noktayı garanti eder. Gerekirse kısa bir fallback bırakır.
        /// </summary>
        private static string CleanReason(string input)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            // normalize whitespace
            var s = Regex.Replace(input, @"\s+", " ").Trim();

            // yasaklı kelimeler: ama, amcak (typo), ancak, fakat, lakin, yalnız
            var bannedWords = new[] { "ama", "amcak", "ancak", "fakat", "lakin", "yalnız" };

            foreach (var word in bannedWords)
            {
                // kelime sınırlarıyla birlikte sil
                s = Regex.Replace(s, $@"\b{word}\b[,:]?", "", RegexOptions.IgnoreCase);
            }

            // tekrar boşluk/noktalama toparla
            s = Regex.Replace(s, @"\s+,", ",");
            s = Regex.Replace(s, @"\s*\.\s*", ". ");
            s = Regex.Replace(s, @"\s+", " ").Trim();

            // cümle sonuna nokta yoksa ekle
            if (!string.IsNullOrEmpty(s) && !".!?…".Contains(s[^1]))
                s += ".";

            // uzunluk kısıtı
            if (s.Length > 220) s = s.Substring(0, 220).TrimEnd('.', ' ') + "…";

            return s;
        }


        private sealed class CompletionShape
        {
            public List<MatchCandidate>? Candidates { get; set; }
        }
    }
}
