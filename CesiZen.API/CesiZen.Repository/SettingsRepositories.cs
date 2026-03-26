using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class UserPrivacyRepository : IUserPrivacyRepository
{
    private readonly CesiZenContext _context;
    public UserPrivacyRepository(CesiZenContext context) => _context = context;

    public async Task<UserPrivacySetting?> GetByUserIdAsync(int userId)
        => await _context.UserPrivacySettings.FirstOrDefaultAsync(s => s.UserId == userId);

    public async Task AddAsync(UserPrivacySetting setting) => await _context.UserPrivacySettings.AddAsync(setting);
    public void Update(UserPrivacySetting setting) => _context.UserPrivacySettings.Update(setting);
    public void Delete(UserPrivacySetting setting) => _context.UserPrivacySettings.Remove(setting);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}

public class UserNotificationRepository : IUserNotificationRepository
{
    private readonly CesiZenContext _context;
    public UserNotificationRepository(CesiZenContext context) => _context = context;

    public async Task<UserNotificationSetting?> GetByUserIdAsync(int userId)
        => await _context.UserNotificationSettings.FirstOrDefaultAsync(s => s.UserId == userId);

    public async Task AddAsync(UserNotificationSetting setting) => await _context.UserNotificationSettings.AddAsync(setting);
    public void Update(UserNotificationSetting setting) => _context.UserNotificationSettings.Update(setting);
    public void Delete(UserNotificationSetting setting) => _context.UserNotificationSettings.Remove(setting);
    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
