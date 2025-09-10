using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using dava_avukat_eslestirme_asistani.DTOs.Match;

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

            // 2) Prompt (Türkçe, detaylı gerekçe + puanlama rehberi)
            string One(string s) => (s ?? string.Empty).Replace("\r", " ").Replace("\n", " ").Trim();

            var sys =
                "Sen bir dava–avukat eşleştirme asistanısın.\n" +
                "- SADECE verilen avukat listesinden seç; listede olmayanı yazma.\n" +
                "- Zorunlu uyum: şehir, dil, pro bono, çalışma grubu (WG). Bunlardan biri tutmazsa adayı ele.\n" +
                "- ÇIKIŞ ŞEMASI: {\"candidates\":[{\"lawyerId\":number,\"score\":number,\"reason\":string}]}\n" +
                "- score: 0–1 arası gerçekçi uygunluk; yuvarlak sayılara (0.80, 0.90, 1.00) meyletme. 1.00 sadece istisnai kusursuzlukta.\n" +
                "- Puanlama rehberi (kompozit): rating (0.45), toplam dava (0.25), deneyim yılı (0.15), açıklama uyumu (0.15).\n" +
                "  • rating: 5 üzerinden normalize et.  • toplam dava: 50=orta, 200+=yüksek.  • deneyim: 3=junior, 6–10=orta, 10+=iyi.\n" +
                "  • açıklama uyumu: case açıklamasındaki anahtar kelimeler ile WG/uzmanlık tutarlılığına bak.\n" +
                "- reason: Türkçe ve bilgi dolu olsun (1–2 kısa cümle, ~200 karakter). Zorunlu eşleşmeler (şehir/dil/pro bono/WG) + güçlü yanlar (rating/dosya/deneyim) + varsa küçük bir trade-off belirt.\n" +
                "- Yalnızca geçerli JSON döndür; JSON dışına yazma.";

            var user = $@"
# CASE
id={caseSum.Id}; title={One(caseSum.Title)};
desc={One(caseSum.Description)};
city={caseSum.City}; language={caseSum.Language};
urgency={caseSum.UrgencyLevel}; requiresProBono={caseSum.RequiresProBono};
workingGroupId={(caseSum.WorkingGroupId?.ToString() ?? "null")};
requiredExperience={caseSum.RequiredExperienceLevel};
estimatedDurationDays={caseSum.EstimatedDurationInDays};

# CANDIDATES (choose top {topK})
{string.Join("\n", candidates.Select(c =>
    $"- id={c.Id}; name={One(c.Name)}; city={c.City}; langs=[{string.Join(",", c.Languages)}]; " +
    $"workGroup={c.WorkGroup}; title={c.Title}; startDate={c.StartDate:yyyy-MM-dd};"))}

# INSTRUCTIONS
- Zorunlu kurallar: şehir, dil, pro bono ve WG uyuşmayan adayı ele.
- Kompozit puanlama rehberine göre skor ver; gereksiz eşitliklerden kaçın.
- reasons Türkçe ve somut olsun; “Şehir=…, Dil=…, Pro bono=…, WG=…” gibi net atıflar yap.
- En iyi {topK} adayı azalan skora göre döndür. Sadece geçerli JSON üret.
";

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

            // 4) Sadece verilen adaylardan gelenleri al; LLM tekrarlarını önle
            var allowed = candidates.Select(c => c.Id).ToHashSet();
            var seen = new HashSet<int>();
            var raw = new List<MatchCandidate>();
            foreach (var x in (parsed.Candidates ?? Enumerable.Empty<MatchCandidate>()))
            {
                if (!allowed.Contains(x.LawyerId)) continue;
                if (seen.Add(x.LawyerId))
                {
                    var reason = (x.Reason ?? string.Empty).Trim();
                    raw.Add(new MatchCandidate(x.LawyerId, Clamp01(x.Score), reason));
                }
            }
            if (raw.Count == 0) return new List<MatchCandidate>();

            // 5) Aday sayısından bağımsız KALİBRASYON (monotonik, 1.00 yok, yuvarlak kalıpları kırar)
            var calibrated = raw
                .Select(x =>
                {
                    // Monotonik, sayıya bağ(ım)sız bir harita:
                    //  - önce 0..1'e kırp, sonra lojistikle yumuşat, ardından [0.40..0.96] bandına al.
                    var baseScore = MonoMap(x.Score);
                    // deterministik çok küçük titreme (yuvarlakları kırmak için), ±0.01
                    var s = Clamp(baseScore + Jitter(caseSum.Id, x.LawyerId), 0.0, 0.96);
                    // okunaklılık
                    s = Math.Round(s, 2);

                    var reason = x.Reason ?? string.Empty;
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

        // Aday sayısından bağımsız, monotonik bir puan haritası:
        //  - Lojistik merkez: 0.5, ölçek: 0.22 (yumuşak S-eğrisi)
        //  - Son aralık: [0.40, 0.96] (1.00 hiçbir zaman olmaz)
        private static double MonoMap(double s)
        {
            s = Clamp01(s);
            var p = 1.0 / (1.0 + Math.Exp(-(s - 0.5) / 0.22)); // 0..1
            return 0.40 + 0.56 * p; // 0.40..0.96
        }

        // Yuvarlak sayıları kırmak için deterministik, küçük jitter (±0.01)
        private static double Jitter(int caseId, int lawyerId)
        {
            unchecked
            {
                int h = 17;
                h = h * 31 + caseId;
                h = h * 31 + lawyerId;
                // 0..1
                double r = ((h & 0x7fffffff) % 1000) / 1000.0;
                return (r - 0.5) * 0.02; // -0.01 .. +0.01
            }
        }

        private sealed class CompletionShape
        {
            public List<MatchCandidate>? Candidates { get; set; }
        }
    }
}
