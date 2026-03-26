using CesiZen.Dto;

namespace CesiZen.Service;

public interface IUserPrivacyService
{
    Task<UserPrivacyDto?> GetByUserIdAsync(int userId);
    Task<bool> UpdateAsync(int userId, UserPrivacyDto dto);
    Task<bool> DeleteAsync(int userId);
}

public interface IUserNotificationService
{
    Task<UserNotificationDto?> GetByUserIdAsync(int userId);
    Task<bool> UpdateAsync(int userId, UserNotificationDto dto);
    Task<bool> DeleteAsync(int userId);
}
