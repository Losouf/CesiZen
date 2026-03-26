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
    public bool DarkTheme { get; set; }
    public string Language { get; set; } = "FR";
}

public class UserPrivacyDto
{
    public bool IsProfilePublic { get; set; }
    public bool DataSharingConsent { get; set; }
}

public class UserNotificationDto
{
    public bool EmailEnabled { get; set; }
    public bool PushEnabled { get; set; }
    public bool WeeklySummary { get; set; }
}

public class GlobalSettingDto
{
    public string Key { get; set; } = null!;
    public string Value { get; set; } = null!;
    public string? Description { get; set; }
}
