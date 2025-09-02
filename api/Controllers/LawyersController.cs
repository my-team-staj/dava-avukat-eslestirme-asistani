using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using dava_avukat_eslestirme_asistani.Services;
using dava_avukat_eslestirme_asistani.DTOs;
using System.Threading.Tasks;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LawyersController : ControllerBase
    {
        private readonly ILawyerService _lawyerService;
        private readonly IMapper _mapper;
        private readonly ILogger<LawyersController> _logger;

        public LawyersController(ILawyerService lawyerService, IMapper mapper, ILogger<LawyersController> logger)
        {
            _lawyerService = lawyerService;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Arama, filtreleme, sıralama ve sayfalama destekli avukat listesini döner.
        /// </summary>
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
                Items = result.Items
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLawyer(int id, [FromBody] LawyerUpdateDto dto)
        {
            try
            {
                var updatedLawyer = await _lawyerService.UpdateLawyerAsync(id, dto);
                return Ok(updatedLawyer);
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

        [HttpPost]
        public async Task<IActionResult> CreateLawyer([FromBody] LawyerCreateDto lawyerDto)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid LawyerCreateDto received.");
                return BadRequest(ModelState);
            }

            var created = await _lawyerService.AddLawyerAsync(lawyerDto);
            var dto = _mapper.Map<LawyerDto>(created);

            return CreatedAtAction(nameof(GetLawyerById), new { id = dto.Id }, dto);
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
            return Ok(lawyer);
        }

        /// <summary>
        /// Soft delete: IsActive=false yapar.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLawyer(int id)
        {
            var ok = await _lawyerService.SoftDeleteLawyerAsync(id);
            if (!ok) return NotFound(new { message = "Avukat bulunamadı." });
            return NoContent();
        }
    }
}
