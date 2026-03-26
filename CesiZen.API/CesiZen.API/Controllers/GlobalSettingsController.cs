using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GlobalSettingsController : ControllerBase
{
    private readonly IGlobalSettingService _service;

    public GlobalSettingsController(IGlobalSettingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GlobalSettingDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{key}")]
    public async Task<ActionResult<GlobalSettingDto>> Get(string key)
    {
        var setting = await _service.GetByKeyAsync(key);
        if (setting == null) return NotFound();
        return Ok(setting);
    }

    [Authorize(Roles = "Admin")] // Assume Admin role for creating/updating
    [HttpPost]
    public async Task<IActionResult> CreateOrUpdate([FromBody] GlobalSettingDto dto)
    {
        await _service.CreateOrUpdateAsync(dto);
        return Ok(new { message = "Setting saved successfully" });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{key}")]
    public async Task<IActionResult> Delete(string key)
    {
        var result = await _service.DeleteAsync(key);
        if (!result) return NotFound();
        return Ok(new { message = "Setting deleted successfully" });
    }
}
