using CesiZen.Dto;

namespace CesiZen.Service;

public interface IUserService
{
    Task<IEnumerable<AdminUserDto>> GetAllAsync();
    Task<AdminUserDto?> GetByIdAsync(int id);
    Task<(AdminUserDto? user, string? error)> CreateAsync(CreateAdminUserDto dto);
    Task<bool> UpdateAsync(int id, UpdateAdminUserDto dto);
    Task<bool> DeleteAsync(int id);
}
