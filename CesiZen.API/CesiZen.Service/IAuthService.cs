using CesiZen.Dto;

namespace CesiZen.Service;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
    Task<UserInfoDto?> GetUserInfoAsync(int userId);
    Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto request);
    Task<bool> UpdatePreferencesAsync(int userId, UserPreferenceDto request);
}
