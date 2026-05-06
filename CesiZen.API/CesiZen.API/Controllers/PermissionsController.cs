using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PermissionsController : ControllerBase
{
    private readonly IPermissionService _service;

    public PermissionsController(IPermissionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PermissionDto>> GetById(int id)
    {
        var perm = await _service.GetByIdAsync(id);
        if (perm == null) return NotFound();
        return Ok(perm);
    }

    [HttpPost]
    public async Task<ActionResult<PermissionDto>> Create([FromBody] CreatePermissionDto dto)
    {
        var (perm, error) = await _service.CreateAsync(dto);
        if (error != null) return BadRequest(error);
        return CreatedAtAction(nameof(GetById), new { id = perm!.Id }, perm);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdatePermissionDto dto)
    {
        var (ok, error) = await _service.UpdateAsync(id, dto);
        if (error != null) return BadRequest(error);
        if (!ok) return NotFound();
        return Ok(new { message = "Permission mise à jour" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound();
        return Ok(new { message = "Permission supprimée" });
    }
}
