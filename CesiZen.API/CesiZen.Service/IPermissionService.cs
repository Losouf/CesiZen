using CesiZen.Dto;

namespace CesiZen.Service;

public interface IPermissionService
{
    Task<IEnumerable<PermissionDto>> GetAllAsync();
    Task<PermissionDto?> GetByIdAsync(int id);
    Task<(PermissionDto? permission, string? error)> CreateAsync(CreatePermissionDto dto);
    Task<(bool ok, string? error)> UpdateAsync(int id, UpdatePermissionDto dto);
    Task<bool> DeleteAsync(int id);
}
