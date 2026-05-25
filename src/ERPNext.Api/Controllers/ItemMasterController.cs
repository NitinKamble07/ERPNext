using ERPNext.Core.Entities;
using ERPNext.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ERPNext.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemMasterController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ItemMasterController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? branchId)
        {
            var q = _db.ItemMaster
                       .AsQueryable()
                       .Where(i => i.IsActive);

            if (branchId.HasValue)
            {
                q = q.Where(i => i.BranchId == branchId.Value);
            }

            var list = await q.ToListAsync();

            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var item = await _db.ItemMaster.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        // Require authentication for create/update/delete
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ItemMaster model)
        {
            // get user id from claims
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            model.Id = Guid.NewGuid();
            model.CreatedAt = DateTime.UtcNow;
            model.CreatedBy = Guid.Parse(userId);
            model.IsActive = true;

            _db.ItemMaster.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] ItemMaster model)
        {
            var existing = await _db.ItemMaster.FindAsync(id);
            if (existing == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            existing.BranchId = model.BranchId;
            existing.ItemName = model.ItemName;
            existing.BrandName = model.BrandName;
            existing.UpdatedBy = Guid.Parse(userId);
            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _db.ItemMaster.FindAsync(id);
            if (existing == null) return NotFound();

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            existing.IsActive = false;
            existing.DeletedAt = DateTime.UtcNow;
            existing.DeletedBy = Guid.Parse(userId);

            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
