using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dava_avukat_eslestirme_asistani.Data;
using dava_avukat_eslestirme_asistani.Entities;
using dava_avukat_eslestirme_asistani.DTOs;

namespace dava_avukat_eslestirme_asistani.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkingGroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkingGroupsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/workinggroups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkingGroup>>> GetWorkingGroups()
        {
            return await _context.WorkingGroups.ToListAsync();
        }

        // GET: api/workinggroups/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkingGroup>> GetWorkingGroup(int id)
        {
            var workingGroup = await _context.WorkingGroups.FindAsync(id);

            if (workingGroup == null)
            {
                return NotFound();
            }

            return workingGroup;
        }

        // POST: api/workinggroups
        [HttpPost]
        public async Task<ActionResult<WorkingGroup>> PostWorkingGroup(WorkingGroup workingGroup)
        {
            _context.WorkingGroups.Add(workingGroup);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorkingGroup", new { id = workingGroup.Id }, workingGroup);
        }

        // PUT: api/workinggroups/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkingGroup(int id, WorkingGroup workingGroup)
        {
            if (id != workingGroup.Id)
            {
                return BadRequest();
            }

            _context.Entry(workingGroup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkingGroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/workinggroups/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkingGroup(int id)
        {
            var workingGroup = await _context.WorkingGroups.FindAsync(id);
            if (workingGroup == null)
            {
                return NotFound();
            }

            _context.WorkingGroups.Remove(workingGroup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkingGroupExists(int id)
        {
            return _context.WorkingGroups.Any(e => e.Id == id);
        }
    }
}
