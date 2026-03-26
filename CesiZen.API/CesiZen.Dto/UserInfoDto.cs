using System;

namespace CesiZen.Dto;

public class UserInfoDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string? Role { get; set; }
    public DateTime? CreatedAt { get; set; }
    public UserPreferenceDto? Preferences { get; set; }
}
