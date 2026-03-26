using System.Security.Claims;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoriteArticlesController : ControllerBase
{
    private readonly IInfoArticleService _service;

    public FavoriteArticlesController(IInfoArticleService service)
    {
        _service = service;
    }

    [HttpPost("toggle/{articleId}")]
    public async Task<IActionResult> Toggle(int articleId)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out int userId))
        {
            return Unauthorized();
        }

        var result = await _service.ToggleFavoriteAsync(userId, articleId);
        if (!result) return NotFound();

        return Ok(new { message = "Favorite toggled successfully" });
    }
}
