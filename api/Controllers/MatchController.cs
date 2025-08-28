using Microsoft.AspNetCore.Mvc;
using dava_avukat_eslestirme_asistani.DTOs.Match;
using dava_avukat_eslestirme_asistani.Services;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchController : ControllerBase
    {
        private readonly CandidateQueryService _cq;
        private readonly LlmMatchService _llm;

        public MatchController(CandidateQueryService cq, LlmMatchService llm)
        {
            _cq = cq; _llm = llm;
        }

        /// <summary>
        /// Dava için en uygun avukatları önerir
        /// </summary>
        /// <param name="req">Eşleştirme isteği parametreleri</param>
        /// <returns>Eşleştirilen avukat listesi</returns>
        /// <response code="200">Başarılı eşleştirme sonucu</response>
        /// <response code="400">Geçersiz istek</response>
        /// <response code="500">Sunucu hatası</response>
        [HttpPost("suggest")]
        [ProducesResponseType(typeof(MatchResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<MatchResponse>> Suggest([FromBody] MatchRequest req)
        {
            var topK = req.TopK <= 0 ? 3 : req.TopK;

            // 1) Case + Aday havuzu
            var (caseSum, candidates) = await _cq.BuildAsync(req.CaseId, take: 30);
            if (candidates.Count == 0)
                return Ok(new MatchResponse(caseSum.Id, new List<MatchCandidate>()));

            // 2) LLM skorlama
            var picks = await _llm.SuggestAsync(caseSum, candidates, topK);

            // 3) Yanıt
            return Ok(new MatchResponse(caseSum.Id, picks));
        }

        // İsteğe bağlı: key sağlık kontrolü (toplantıdan sonra sil)
        [HttpGet("_checkKey")]
        public ActionResult<object> CheckKey([FromServices] IConfiguration cfg)
        {
            var k = cfg["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY");
            if (string.IsNullOrWhiteSpace(k)) return Problem("Key yok.");
            return Ok(new { ok = true, source = cfg["OpenAI:ApiKey"] != null ? "secrets" : "env", len = k.Length });
        }
    }
}

