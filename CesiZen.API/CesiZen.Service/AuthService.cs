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
            Preferences = prefs != null ? new UserPreferenceDto
            {
                EmailNotifications = prefs.EmailNotifications,
                PushNotifications = prefs.PushNotifications,
                DarkTheme = prefs.DarkTheme,
                IsProfilePublic = prefs.IsProfilePublic,
                Language = prefs.Language
            } : null
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

        prefs.EmailNotifications = request.EmailNotifications;
        prefs.PushNotifications = request.PushNotifications;
        prefs.DarkTheme = request.DarkTheme;
        prefs.IsProfilePublic = request.IsProfilePublic;
        prefs.Language = request.Language;

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
