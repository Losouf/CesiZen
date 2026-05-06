using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IRoleService _service;

    public RolesController(IRoleService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleDto>> GetById(int id)
    {
        var role = await _service.GetByIdAsync(id);
        if (role == null) return NotFound();
        return Ok(role);
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> Create([FromBody] CreateRoleDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRoleDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok(new { message = "Role updated successfully" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Role deleted successfully" });
    }

    [HttpGet("permissions")]
    public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAllPermissions()
    {
        return Ok(await _service.GetAllPermissionsAsync());
    }

    [HttpGet("{id}/permissions")]
    public async Task<ActionResult<RoleWithPermissionsDto>> GetRolePermissions(int id)
    {
        var role = await _service.GetWithPermissionsAsync(id);
        if (role == null) return NotFound();
        return Ok(role);
    }

    [HttpPost("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> AddPermission(int id, int permissionId)
    {
        var ok = await _service.AddPermissionAsync(id, permissionId);
        if (!ok) return NotFound();
        return Ok(new { message = "Permission attribuée au rôle" });
    }

    [HttpDelete("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> RemovePermission(int id, int permissionId)
    {
        var ok = await _service.RemovePermissionAsync(id, permissionId);
        if (!ok) return NotFound();
        return Ok(new { message = "Permission retirée du rôle" });
    }
}
