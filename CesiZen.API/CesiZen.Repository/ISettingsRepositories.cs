using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IUserPrivacyRepository
{
    Task<UserPrivacySetting?> GetByUserIdAsync(int userId);
    Task AddAsync(UserPrivacySetting setting);
    void Update(UserPrivacySetting setting);
    void Delete(UserPrivacySetting setting);
    Task SaveChangesAsync();
}

public interface IUserNotificationRepository
{
    Task<UserNotificationSetting?> GetByUserIdAsync(int userId);
    Task AddAsync(UserNotificationSetting setting);
    void Update(UserNotificationSetting setting);
    void Delete(UserNotificationSetting setting);
    Task SaveChangesAsync();
}
