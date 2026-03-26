using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InfoArticlesController : ControllerBase
{
    private readonly IInfoArticleService _service;

    public InfoArticlesController(IInfoArticleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InfoArticleDto>>> GetAll()
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int id)) userId = id;
        }
        return Ok(await _service.GetAllAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InfoArticleDto>> GetById(int id)
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (int.TryParse(userIdStr, out int uid)) userId = uid;
        }
        var article = await _service.GetByIdAsync(id, userId);
        if (article == null) return NotFound();
        return Ok(article);
    }

    [Authorize(Roles = "Admin,Moderator,User")]
    [HttpPost]
    public async Task<ActionResult<InfoArticleDto>> Create([FromBody] CreateInfoArticleDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [Authorize(Roles = "Admin,Moderator,User")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateInfoArticleDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok(new { message = "Article updated successfully" });
    }

    [Authorize(Roles = "Admin,Moderator")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Article deleted successfully" });
    }
}
