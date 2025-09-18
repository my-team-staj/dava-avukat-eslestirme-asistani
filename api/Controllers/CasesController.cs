using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using dava_avukat_eslestirme_asistani.Services;
using dava_avukat_eslestirme_asistani.DTOs;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CasesController : ControllerBase
    {
        private readonly ICaseService _caseService;
        private readonly IMapper _mapper;
        private readonly ILogger<CasesController> _logger;

        public CasesController(ICaseService caseService, IMapper mapper, ILogger<CasesController> logger)
        {
            _caseService = caseService;
            _mapper = mapper;
            _logger = logger;
        }

        // --- Create ---
        [HttpPost]
        public async Task<IActionResult> CreateCase([FromBody] CaseCreateDto caseDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _caseService.CreateCaseAsync(caseDto);
            var dto = _mapper.Map<CaseDto>(created);

            return CreatedAtAction(nameof(GetCaseById), new { id = dto.Id }, dto);
        }

        // --- Get by Id ---
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCaseById(int id)
        {
            var entity = await _caseService.GetCaseByIdAsync(id);
            if (entity == null)
                return NotFound();

            var dto = _mapper.Map<CaseDto>(entity);
            return Ok(dto);
        }

        // --- Get list (query support) ---
        [HttpGet]
        public async Task<IActionResult> GetCases([FromQuery] CaseQueryParameters parameters)
        {
            var result = await _caseService.GetCasesAsync(parameters);
            return Ok(result);
        }

        // --- Update ---
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCase(int id, [FromBody] CaseUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _caseService.UpdateCaseAsync(id, dto);
            if (updated is null)
                return NotFound();

            var result = _mapper.Map<CaseDto>(updated);
            return Ok(result); // alternatif: return NoContent();
        }

        // --- Soft Delete ---
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCase(int id)
        {
            var ok = await _caseService.DeleteCaseAsync(id);
            if (!ok)
                return NotFound();

            return NoContent();
        }
    }
}
