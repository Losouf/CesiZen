using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserSessionsController : ControllerBase
{
    private readonly IUserSessionService _service;

    public UserSessionsController(IUserSessionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserSessionDto>>> GetAll()
    {
        int? userId = null;
        if (!User.IsInRole("Admin"))
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdStr, out int id)) userId = id;
        }
        return Ok(await _service.GetAllAsync(userId));
    }

    [HttpPost("revoke/{id}")]
    public async Task<IActionResult> Revoke(int id)
    {
        var result = await _service.RevokeAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Session revoked successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Session deleted successfully" });
    }
}
