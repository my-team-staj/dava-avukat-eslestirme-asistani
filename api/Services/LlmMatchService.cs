using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
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

            // 2) Prompt (Türkçe, yeni title’lara göre)
            string One(string? s) => (s ?? string.Empty).Replace("\r", " ").Replace("\n", " ").Trim();

            var sys =
                "Sen bir dava–avukat eşleştirme asistanısın.\n" +
                "- SADECE verilen avukat listesinden seç; listede olmayanı yazma.\n" +
                "- Zorunlu uyum: ŞEHİR (Case.City ≡ Lawyer.City). Uymayan adayı ele.\n" +
                "- Değerlendirme sinyalleri (ağırlıklar):\n" +
                "  • Deneyim yılı (0.50) – ExperienceYears.\n" +
                "  • WorkGroup/Title uyumu (0.30) – Case açıklamasındaki anahtarlarla adayın WorkGroup/Title eşleşmesi.\n" +
                "  • Metinsel açıklama uyumu (0.20) – Case.SubjectMatterDescription veya Description ile adayın Title/Education/Languages bilgileri arasındaki anlamlı ilişki.\n" +
                "- Dil/Pro bono gibi alanlar verilmediyse zorunlu tutma.\n" +
                "- ÇIKIŞ ŞEMASI: {\"candidates\":[{\"lawyerId\":number,\"score\":number,\"reason\":string}]}\n" +
                "- score: 0–1 arası gerçekçi; 1.00 verme, yuvarlak skorlardan kaçın.\n" +
                "- reason: Türkçe, 1–2 kısa cümle (~200 karakter). Şehir uyumu + güçlü yanlar (deneyim/WG-Title/anahtar kelime) + küçük bir trade-off belirt.\n" +
                "- Yalnızca geçerli JSON döndür; JSON dışına yazma.";

            // Case özet bloğu
            var caseBlock = $@"
# CASE
id={caseSum.Id};
contactClient={One(caseSum.ContactClient)};
fileSubject={One(caseSum.FileSubject)};
caseResponsible={One(caseSum.CaseResponsible)};
natureOfAssignment={One(caseSum.PrmNatureOfAssignment)};
placeOfUseSubject={One(caseSum.PrmCasePlaceofUseSubject)};
subjectMatterDescription={One(caseSum.SubjectMatterDescription)};
isToBeInvoiced={(caseSum.IsToBeInvoiced ? "true" : "false")};
city={One(caseSum.City)};
description={One(caseSum.Description)};
country={One(caseSum.Country)};
county={One(caseSum.County)};
address={One(caseSum.Address)};
attorney1={One(caseSum.Attorney1)};
attorney2={One(caseSum.Attorney2)};
attorney3={One(caseSum.Attorney3)};";

            // Adaylar bloğu (yeni LawyerCard alanları)
            var candsBlock = string.Join("\n", candidates.Select(c =>
                $"- id={c.Id}; fullName={One(c.FullName)}; city={One(c.City)}; " +
                $"expYears={c.ExperienceYears}; " +
                $"langs=[{string.Join(",", (c.Languages ?? Array.Empty<string>()).Select(One))}]; " +
                $"title={One(c.Title)}; education={One(c.Education)}; " +
                $"workGroupId={c.WorkGroupId}; workGroup={One(c.WorkGroup)};"
            ));

            var user = $@"
{caseBlock}

# CANDIDATES (choose top {topK})
{candsBlock}

# INSTRUCTIONS
- Zorunlu kural: CITY uyuşmalı. Uyuşmayan adayı ele.
- Belirtilen ağırlıklara göre skoru hesapla; gereksiz eşitliklerden kaçın.
- reasons Türkçe ve somut olsun; şehir uyumu + güçlü yanlar + küçük bir trade-off belirt.
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

            // 5) Kalibrasyon (monotonik; 1.00 yok; yuvarlakları kırar)
            var calibrated = raw
                .Select(x =>
                {
                    var baseScore = MonoMap(x.Score);
                    var s = Clamp(baseScore + Jitter(caseSum.Id, x.LawyerId), 0.0, 0.96);
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

        private sealed class CompletionShape
        {
            public List<MatchCandidate>? Candidates { get; set; }
        }
    }
}
