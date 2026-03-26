using System;

namespace CesiZen.Dto;

public class UpdateProfileDto
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? ProfilePictureUrl { get; set; }
}

public class UserPreferenceDto
{
    public bool EmailNotifications { get; set; }
    public bool PushNotifications { get; set; }
    public bool DarkTheme { get; set; }
    public bool IsProfilePublic { get; set; }
    public string Language { get; set; } = "FR";
}

public class GlobalSettingDto
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string? Description { get; set; }
}
