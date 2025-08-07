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
        /// Arama, filtreleme ve sayfalama destekli avukat listesini döner.
        /// </summary>
        /// <param name="search">İsim, şehir veya dil araması</param>
        /// <param name="city">Şehir filtresi</param>
        /// <param name="isActive">Aktiflik filtresi</param>
        /// <param name="page">Sayfa numarası (varsayılan: 1)</param>
        /// <param name="pageSize">Sayfa boyutu (varsayılan: 10)</param>
        [HttpGet]
        public async Task<IActionResult> GetLawyers(
            [FromQuery] string? search,
            [FromQuery] string? city,
            [FromQuery] bool? isActive,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var (data, totalCount) = await _lawyerService.GetLawyersAsync(search, city, isActive, page, pageSize);

            return Ok(new
            {
                TotalCount = totalCount,
                Data = data
            });
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

            return CreatedAtAction(nameof(GetLawyerById), new { id = dto.Id }, new { id = dto.Id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLawyerById(int id)
        {
            var lawyer = await _lawyerService.GetLawyerByIdAsync(id);
            if (lawyer == null)
            {
                _logger.LogWarning($"Lawyer with id {id} not found.");
                return NotFound();
            }
            return Ok(lawyer);
        }
    }
}
