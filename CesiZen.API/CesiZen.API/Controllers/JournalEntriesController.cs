using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JournalEntriesController : ControllerBase
{
    private readonly IJournalEntryService _service;

    public JournalEntriesController(IJournalEntryService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<JournalEntryDto>>> GetAll()
    {
        int? userId = null;
        if (!User.IsInRole("Admin") && !User.IsInRole("Moderator"))
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int id)) userId = id;
        }
        return Ok(await _service.GetAllAsync(userId));
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<JournalEntryDto>> GetById(int id)
    {
        var entry = await _service.GetByIdAsync(id);
        if (entry == null) return NotFound();

        // Security check: only owner or admin/mod can see
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out int currentUserId))
        {
            if (entry.UserId != currentUserId && !User.IsInRole("Admin") && !User.IsInRole("Moderator"))
            {
                return Forbid();
            }
        }

        return Ok(entry);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<JournalEntryDto>> Create([FromBody] CreateJournalEntryDto dto)
    {
        // Enforce UserId from token if not admin
        if (!User.IsInRole("Admin"))
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int currentUserId))
            {
                dto.UserId = currentUserId;
            }
        }

        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateJournalEntryDto dto)
    {
        var entry = await _service.GetByIdAsync(id);
        if (entry == null) return NotFound();

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out int currentUserId))
        {
            if (entry.UserId != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }
        }

        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok(new { message = "Journal entry updated successfully" });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entry = await _service.GetByIdAsync(id);
        if (entry == null) return NotFound();

        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out int currentUserId))
        {
            if (entry.UserId != currentUserId && !User.IsInRole("Admin"))
            {
                return Forbid();
            }
        }

        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Journal entry deleted successfully" });
    }
}
