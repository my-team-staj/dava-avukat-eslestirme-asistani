using Microsoft.AspNetCore.Mvc;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.Repositories;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkingGroupsController : ControllerBase
    {
        private readonly IRepository<WorkingGroup> _workingGroupRepository;

        public WorkingGroupsController(IRepository<WorkingGroup> workingGroupRepository)
        {
            _workingGroupRepository = workingGroupRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var groups = await _workingGroupRepository.GetAllAsync();
            return Ok(groups);
        }
    }
}
