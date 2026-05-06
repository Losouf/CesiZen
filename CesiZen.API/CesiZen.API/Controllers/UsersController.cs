using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminUserDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdminUserDto>> GetById(int id)
    {
        var user = await _service.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<AdminUserDto>> Create([FromBody] CreateAdminUserDto dto)
    {
        var (user, error) = await _service.CreateAsync(dto);
        if (error != null) return BadRequest(error);
        return CreatedAtAction(nameof(GetById), new { id = user!.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAdminUserDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (!result) return NotFound();
        return Ok(new { message = "Utilisateur mis à jour" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Utilisateur supprimé" });
    }
}
