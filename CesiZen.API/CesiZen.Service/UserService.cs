using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;
using BC = BCrypt.Net.BCrypt;

namespace CesiZen.Service;

public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AdminUserDto>> GetAllAsync()
    {
        var users = await _repository.GetAllAsync();
        return users.Select(MapToDto);
    }

    public async Task<AdminUserDto?> GetByIdAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        return user == null ? null : MapToDto(user);
    }

    public async Task<(AdminUserDto? user, string? error)> CreateAsync(CreateAdminUserDto dto)
    {
        if (await _repository.EmailExistsAsync(dto.Email))
            return (null, "Email déjà utilisé");
        if (await _repository.UsernameExistsAsync(dto.Username))
            return (null, "Nom d'utilisateur déjà utilisé");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            DisplayName = dto.DisplayName ?? dto.Username,
            PasswordHash = BC.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow,
            RoleId = dto.RoleId
        };

        await _repository.AddAsync(user);
        await _repository.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(user.Id);
        return (created != null ? MapToDto(created) : MapToDto(user), null);
    }

    public async Task<bool> UpdateAsync(int id, UpdateAdminUserDto dto)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return false;

        if (!string.IsNullOrWhiteSpace(dto.DisplayName)) user.DisplayName = dto.DisplayName;
        if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email;
        if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;
        if (!string.IsNullOrWhiteSpace(dto.NewPassword)) user.PasswordHash = BC.HashPassword(dto.NewPassword);

        _repository.Update(user);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) return false;

        _repository.Delete(user);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static AdminUserDto MapToDto(User user)
    {
        return new AdminUserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            DisplayName = user.DisplayName,
            Role = user.Role?.Label,
            RoleId = user.RoleId,
            CreatedAt = user.CreatedAt
        };
    }
}
