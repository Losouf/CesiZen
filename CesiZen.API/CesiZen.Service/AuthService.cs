using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BC = BCrypt.Net.BCrypt;

namespace CesiZen.Service;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !BC.Verify(request.Password, user.PasswordHash))
        {
            return null;
        }

        return GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        var existingEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingEmail != null) return null;

        var existingUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUsername != null) return null;

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BC.HashPassword(request.Password),
            DisplayName = request.DisplayName ?? request.Username,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        return GenerateAuthResponse(user);
    }

    public async Task<UserInfoDto?> GetUserInfoAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        var prefs = user.UserPreferences.FirstOrDefault();
        var privacy = user.UserPrivacySettings.FirstOrDefault();
        var notifications = user.UserNotificationSettings.FirstOrDefault();

        bool needsSave = false;
        if (privacy == null)
        {
            privacy = new CesiZen.Data.CesiZen.Model.UserPrivacySetting { UserId = userId, IsProfilePublic = false, DataSharingConsent = true, LastUpdated = DateTime.UtcNow };
            user.UserPrivacySettings.Add(privacy);
            needsSave = true;
        }

        if (notifications == null)
        {
            notifications = new CesiZen.Data.CesiZen.Model.UserNotificationSetting { UserId = userId, EmailEnabled = true, PushEnabled = true, WeeklySummary = true, LastUpdated = DateTime.UtcNow };
            user.UserNotificationSettings.Add(notifications);
            needsSave = true;
        }

        if (needsSave)
        {
            await _userRepository.SaveChangesAsync();
        }

        return new UserInfoDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Bio = user.Bio,
            Phone = user.Phone,
            BirthDate = user.BirthDate,
            ProfilePictureUrl = user.ProfilePictureUrl,
            Role = user.Role?.Label,
            CreatedAt = user.CreatedAt,
            Preferences = prefs != null ? new UserPreferenceDto { DarkTheme = prefs.DarkTheme, Language = prefs.Language } : null,
            Privacy = new UserPrivacyDto { IsProfilePublic = privacy.IsProfilePublic, DataSharingConsent = privacy.DataSharingConsent },
            Notifications = new UserNotificationDto { EmailEnabled = notifications.EmailEnabled, PushEnabled = notifications.PushEnabled, WeeklySummary = notifications.WeeklySummary }
        };
    }

    public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        user.DisplayName = request.DisplayName;
        user.Bio = request.Bio;
        user.Phone = request.Phone;
        user.BirthDate = request.BirthDate;
        user.ProfilePictureUrl = request.ProfilePictureUrl;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdatePreferencesAsync(int userId, UserPreferenceDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        var prefs = user.UserPreferences.FirstOrDefault();
        if (prefs == null)
        {
            prefs = new CesiZen.Data.CesiZen.Model.UserPreference { UserId = userId };
            user.UserPreferences.Add(prefs);
        }

        prefs.DarkTheme = request.DarkTheme;
        prefs.Language = request.Language;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }

    public async Task<UserPrivacyDto?> GetPrivacyAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        var privacy = user.UserPrivacySettings.FirstOrDefault();
        if (privacy == null) return new UserPrivacyDto { IsProfilePublic = false, DataSharingConsent = true };

        return new UserPrivacyDto
        {
            IsProfilePublic = privacy.IsProfilePublic,
            DataSharingConsent = privacy.DataSharingConsent
        };
    }

    public async Task<bool> UpdatePrivacyAsync(int userId, UserPrivacyDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        var privacy = user.UserPrivacySettings.FirstOrDefault();
        if (privacy == null)
        {
            privacy = new CesiZen.Data.CesiZen.Model.UserPrivacySetting { UserId = userId };
            user.UserPrivacySettings.Add(privacy);
        }

        privacy.IsProfilePublic = request.IsProfilePublic;
        privacy.DataSharingConsent = request.DataSharingConsent;
        privacy.LastUpdated = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }

    public async Task<UserNotificationDto?> GetNotificationsAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        var notifications = user.UserNotificationSettings.FirstOrDefault();
        if (notifications == null) return new UserNotificationDto { EmailEnabled = true, PushEnabled = true, WeeklySummary = true };

        return new UserNotificationDto
        {
            EmailEnabled = notifications.EmailEnabled,
            PushEnabled = notifications.PushEnabled,
            WeeklySummary = notifications.WeeklySummary
        };
    }

    public async Task<bool> UpdateNotificationsAsync(int userId, UserNotificationDto request)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        var notifications = user.UserNotificationSettings.FirstOrDefault();
        if (notifications == null)
        {
            notifications = new CesiZen.Data.CesiZen.Model.UserNotificationSetting { UserId = userId };
            user.UserNotificationSettings.Add(notifications);
        }

        notifications.EmailEnabled = request.EmailEnabled;
        notifications.PushEnabled = request.PushEnabled;
        notifications.WeeklySummary = request.WeeklySummary;
        notifications.LastUpdated = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return true;
    }

    private AuthResponseDto GenerateAuthResponse(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.Label ?? "User")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new AuthResponseDto
        {
            Token = tokenHandler.WriteToken(token),
            Username = user.Username,
            Email = user.Email,
            ExpiresAt = tokenDescriptor.Expires.Value
        };
    }
}
