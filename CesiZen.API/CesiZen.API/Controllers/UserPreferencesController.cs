using System.Security.Claims;
using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserPreferencesController : ControllerBase
{
    private readonly IUserPreferenceService _service;
    public UserPreferencesController(IUserPreferenceService service) => _service = service;

    [HttpGet("me")]
    public async Task<ActionResult<UserPreferenceDto>> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.GetByUserIdAsync(userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserPreferenceDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _service.UpdateAsync(userId, dto);
        return Ok(new { message = "User preferences updated" });
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.DeleteAsync(userId);
        if (!result) return NotFound();
        return Ok(new { message = "User preferences deleted" });
    }
}
