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
                _logger.LogWarning($"Lawyer with id {id} not found.");
                return NotFound();
            }
            return Ok(lawyer);
        } 
    }
}
