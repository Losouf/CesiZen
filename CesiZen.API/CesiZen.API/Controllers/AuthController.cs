using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Mvc;

namespace CesiZen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var response = await _authService.LoginAsync(request);
        if (response == null) return Unauthorized("Invalid email or password.");
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var response = await _authService.RegisterAsync(request);
        if (response == null) return BadRequest("Email already in use.");
        return Ok(response);
    }
}
