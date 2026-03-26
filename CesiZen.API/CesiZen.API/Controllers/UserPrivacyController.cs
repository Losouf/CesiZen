using System.Security.Claims;
using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserPrivacyController : ControllerBase
{
    private readonly IUserPrivacyService _service;
    public UserPrivacyController(IUserPrivacyService service) => _service = service;

    [HttpGet("me")]
    public async Task<ActionResult<UserPrivacyDto>> GetMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.GetByUserIdAsync(userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserPrivacyDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _service.UpdateAsync(userId, dto);
        return Ok(new { message = "Privacy settings updated" });
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteMe()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _service.DeleteAsync(userId);
        if (!result) return NotFound();
        return Ok(new { message = "Privacy settings deleted" });
    }
}
