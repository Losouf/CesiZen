using CesiZen.Dto;
using CesiZen.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        if (response == null) return BadRequest("Username or Email already in use.");
        return Ok(response);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        if (!int.TryParse(userIdClaim.Value, out int userId)) return BadRequest("Invalid user ID in token.");

        var userInfo = await _authService.GetUserInfoAsync(userId);
        if (userInfo == null) return NotFound("User not found.");

        return Ok(userInfo);
    }

    [Authorize]
    [HttpPut("me/profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.UpdateProfileAsync(userId, request);
        if (!result) return NotFound("User not found.");

        return Ok(new { message = "Profile updated successfully" });
    }

    [Authorize]
    [HttpPut("me/preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferenceDto request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.UpdatePreferencesAsync(userId, request);
        if (!result) return NotFound("User not found.");

        return Ok(new { message = "Preferences updated successfully" });
    }

    [Authorize]
    [HttpGet("me/privacy")]
    public async Task<IActionResult> GetPrivacy()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.GetPrivacyAsync(userId);
        if (result == null) return NotFound("User not found.");

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me/privacy")]
    public async Task<IActionResult> UpdatePrivacy([FromBody] UserPrivacyDto request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.UpdatePrivacyAsync(userId, request);
        if (!result) return NotFound("User not found.");

        return Ok(new { message = "Privacy settings updated successfully" });
    }

    [Authorize]
    [HttpGet("me/notifications")]
    public async Task<IActionResult> GetNotifications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.GetNotificationsAsync(userId);
        if (result == null) return NotFound("User not found.");

        return Ok(result);
    }

    [Authorize]
    [HttpPut("me/notifications")]
    public async Task<IActionResult> UpdateNotifications([FromBody] UserNotificationDto request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId)) return Unauthorized();

        var result = await _authService.UpdateNotificationsAsync(userId, request);
        if (!result) return NotFound("User not found.");

        return Ok(new { message = "Notification settings updated successfully" });
    }
}
