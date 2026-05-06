using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllAsync();
    Task<Role?> GetByIdAsync(int id);
    Task AddAsync(Role role);
    void Update(Role role);
    void Delete(Role role);
    Task<IEnumerable<Permission>> GetAllPermissionsAsync();
    Task<IEnumerable<Permission>> GetPermissionsForRoleAsync(int roleId);
    Task<bool> AddPermissionToRoleAsync(int roleId, int permissionId);
    Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId);
    Task SaveChangesAsync();
}
