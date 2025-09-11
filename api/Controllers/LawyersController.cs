using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using dava_avukat_eslestirme_asistani.DTOs;
using dava_avukat_eslestirme_asistani.Services;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LawyersController : ControllerBase
    {
        private readonly ILawyerService _lawyerService;
        private readonly IMapper _mapper;
        private readonly ILogger<LawyersController> _logger;

        public LawyersController(
            ILawyerService lawyerService,
            IMapper mapper,
            ILogger<LawyersController> logger)
        {
            _lawyerService = lawyerService;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>Arama, filtreleme, sıralama ve sayfalama destekli avukat listesini döner.</summary>
        [HttpGet]
        public async Task<IActionResult> GetLawyers([FromQuery] LawyerQueryParameters query)
        {
            var result = await _lawyerService.GetLawyersAsync(query);

            var response = new PaginatedResponse<LawyerDto>
            {
                Page = query.Page,
                PageSize = query.PageSize,
                TotalItems = result.TotalItems,
                TotalPages = result.TotalPages,
                // Servis entity döndürüyor olabilir; güvenli tarafta kalmak için map’liyoruz
                Items = result.Items.Select(x => _mapper.Map<LawyerDto>(x)).ToList()
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLawyerById(int id)
        {
            var lawyer = await _lawyerService.GetLawyerByIdAsync(id);
            if (lawyer == null)
            {
                _logger.LogWarning("Lawyer with id {Id} not found.", id);
                return NotFound();
            }

            var dto = _mapper.Map<LawyerDto>(lawyer);
            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLawyer([FromBody] LawyerCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid LawyerCreateDto received.");
                return BadRequest(ModelState);
            }

            var createdEntity = await _lawyerService.AddLawyerAsync(dto);
            var createdDto = _mapper.Map<LawyerDto>(createdEntity);

            return CreatedAtAction(nameof(GetLawyerById), new { id = createdDto.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLawyer(int id, [FromBody] LawyerUpdateDto dto)
        {
            try
            {
                var updated = await _lawyerService.UpdateLawyerAsync(id, dto);
                var updatedDto = _mapper.Map<LawyerDto>(updated);
                return Ok(updatedDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>Soft delete (IsDeleted/DeletedAt setlenir; servis implementasyonuna göre IsActive de devre dışı bırakılabilir).</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLawyer(int id)
        {
            var ok = await _lawyerService.SoftDeleteLawyerAsync(id);
            if (!ok) return NotFound(new { message = "Avukat bulunamadı." });
            return NoContent();
        }
    }
}
