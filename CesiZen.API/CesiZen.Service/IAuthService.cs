using CesiZen.Dto;

namespace CesiZen.Service;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<UserInfoDto?> GetUserInfoAsync(int userId);
    Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto request);
    Task<bool> UpdatePreferencesAsync(int userId, UserPreferenceDto request);
    Task<UserPrivacyDto?> GetPrivacyAsync(int userId);
    Task<bool> UpdatePrivacyAsync(int userId, UserPrivacyDto request);
    Task<UserNotificationDto?> GetNotificationsAsync(int userId);
    Task<bool> UpdateNotificationsAsync(int userId, UserNotificationDto request);
}
