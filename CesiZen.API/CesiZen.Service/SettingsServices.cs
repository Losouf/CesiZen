using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class UserPrivacyService : IUserPrivacyService
{
    private readonly IUserPrivacyRepository _repository;
    public UserPrivacyService(IUserPrivacyRepository repository) => _repository = repository;

    public async Task<UserPrivacyDto?> GetByUserIdAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null) 
        {
            // Auto-create default settings
            s = new UserPrivacySetting 
            { 
                UserId = userId, 
                IsProfilePublic = false, 
                DataSharingConsent = true,
                LastUpdated = DateTime.UtcNow 
            };
            await _repository.AddAsync(s);
            await _repository.SaveChangesAsync();
        }
        return new UserPrivacyDto { IsProfilePublic = s.IsProfilePublic, DataSharingConsent = s.DataSharingConsent };
    }

    public async Task<bool> UpdateAsync(int userId, UserPrivacyDto dto)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null)
        {
            s = new UserPrivacySetting { UserId = userId, IsProfilePublic = dto.IsProfilePublic, DataSharingConsent = dto.DataSharingConsent, LastUpdated = DateTime.UtcNow };
            await _repository.AddAsync(s);
        }
        else
        {
            s.IsProfilePublic = dto.IsProfilePublic;
            s.DataSharingConsent = dto.DataSharingConsent;
            s.LastUpdated = DateTime.UtcNow;
            _repository.Update(s);
        }
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null) return false;
        _repository.Delete(s);
        await _repository.SaveChangesAsync();
        return true;
    }
}

public class UserNotificationService : IUserNotificationService
{
    private readonly IUserNotificationRepository _repository;
    public UserNotificationService(IUserNotificationRepository repository) => _repository = repository;

    public async Task<UserNotificationDto?> GetByUserIdAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null)
        {
            // Auto-create default settings
            s = new UserNotificationSetting 
            { 
                UserId = userId, 
                EmailEnabled = true, 
                PushEnabled = true, 
                WeeklySummary = true,
                LastUpdated = DateTime.UtcNow 
            };
            await _repository.AddAsync(s);
            await _repository.SaveChangesAsync();
        }
        return new UserNotificationDto { EmailEnabled = s.EmailEnabled, PushEnabled = s.PushEnabled, WeeklySummary = s.WeeklySummary };
    }

    public async Task<bool> UpdateAsync(int userId, UserNotificationDto dto)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null)
        {
            s = new UserNotificationSetting { UserId = userId, EmailEnabled = dto.EmailEnabled, PushEnabled = dto.PushEnabled, WeeklySummary = dto.WeeklySummary, LastUpdated = DateTime.UtcNow };
            await _repository.AddAsync(s);
        }
        else
        {
            s.EmailEnabled = dto.EmailEnabled;
            s.PushEnabled = dto.PushEnabled;
            s.WeeklySummary = dto.WeeklySummary;
            s.LastUpdated = DateTime.UtcNow;
            _repository.Update(s);
        }
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null) return false;
        _repository.Delete(s);
        await _repository.SaveChangesAsync();
        return true;
    }
}

public class UserPreferenceService : IUserPreferenceService
{
    private readonly IUserPreferenceRepository _repository;
    public UserPreferenceService(IUserPreferenceRepository repository) => _repository = repository;

    public async Task<UserPreferenceDto?> GetByUserIdAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null)
        {
            s = new UserPreference
            {
                UserId = userId,
                DarkTheme = false,
                Language = "FR",
                EmailNotifications = true,
                PushNotifications = true,
                IsProfilePublic = false
            };
            await _repository.AddAsync(s);
            await _repository.SaveChangesAsync();
        }
        return new UserPreferenceDto
        {
            DarkTheme = s.DarkTheme,
            Language = s.Language
        };
    }

    public async Task<bool> UpdateAsync(int userId, UserPreferenceDto dto)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null)
        {
            s = new UserPreference
            {
                UserId = userId,
                DarkTheme = dto.DarkTheme,
                Language = dto.Language,
                EmailNotifications = true,
                PushNotifications = true,
                IsProfilePublic = false
            };
            await _repository.AddAsync(s);
        }
        else
        {
            s.DarkTheme = dto.DarkTheme;
            s.Language = dto.Language;
            _repository.Update(s);
        }
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int userId)
    {
        var s = await _repository.GetByUserIdAsync(userId);
        if (s == null) return false;
        _repository.Delete(s);
        await _repository.SaveChangesAsync();
        return true;
    }
}
