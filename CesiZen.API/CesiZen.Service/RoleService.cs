using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public interface IRoleService
{
    Task<IEnumerable<RoleDto>> GetAllAsync();
    Task<RoleDto?> GetByIdAsync(int id);
    Task<RoleDto> CreateAsync(CreateRoleDto dto);
    Task<bool> UpdateAsync(int id, UpdateRoleDto dto);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();
    Task<RoleWithPermissionsDto?> GetWithPermissionsAsync(int roleId);
    Task<bool> AddPermissionAsync(int roleId, int permissionId);
    Task<bool> RemovePermissionAsync(int roleId, int permissionId);
}

public class RoleService : IRoleService
{
    private readonly IRoleRepository _repository;

    public RoleService(IRoleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<RoleDto>> GetAllAsync()
    {
        var roles = await _repository.GetAllAsync();
        return roles.Select(r => new RoleDto { Id = r.Id, Label = r.Label });
    }

    public async Task<RoleDto?> GetByIdAsync(int id)
    {
        var role = await _repository.GetByIdAsync(id);
        return role == null ? null : new RoleDto { Id = role.Id, Label = role.Label };
    }

    public async Task<RoleDto> CreateAsync(CreateRoleDto dto)
    {
        var role = new Role { Label = dto.Label };
        await _repository.AddAsync(role);
        await _repository.SaveChangesAsync();
        return new RoleDto { Id = role.Id, Label = role.Label };
    }

    public async Task<bool> UpdateAsync(int id, UpdateRoleDto dto)
    {
        var role = await _repository.GetByIdAsync(id);
        if (role == null) return false;
        role.Label = dto.Label;
        _repository.Update(role);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var role = await _repository.GetByIdAsync(id);
        if (role == null) return false;
        _repository.Delete(role);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync()
    {
        var permissions = await _repository.GetAllPermissionsAsync();
        return permissions.Select(p => new PermissionDto { Id = p.Id, Label = p.Label, Code = p.Code });
    }

    public async Task<RoleWithPermissionsDto?> GetWithPermissionsAsync(int roleId)
    {
        var role = await _repository.GetByIdAsync(roleId);
        if (role == null) return null;

        var perms = await _repository.GetPermissionsForRoleAsync(roleId);
        return new RoleWithPermissionsDto
        {
            Id = role.Id,
            Label = role.Label,
            Permissions = perms.Select(p => new PermissionDto
            {
                Id = p.Id,
                Label = p.Label,
                Code = p.Code
            }).ToList()
        };
    }

    public async Task<bool> AddPermissionAsync(int roleId, int permissionId)
    {
        var ok = await _repository.AddPermissionToRoleAsync(roleId, permissionId);
        if (ok) await _repository.SaveChangesAsync();
        return ok;
    }

    public async Task<bool> RemovePermissionAsync(int roleId, int permissionId)
    {
        var ok = await _repository.RemovePermissionFromRoleAsync(roleId, permissionId);
        if (ok) await _repository.SaveChangesAsync();
        return ok;
    }
}
