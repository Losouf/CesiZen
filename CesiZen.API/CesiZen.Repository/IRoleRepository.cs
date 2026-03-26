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
    Task SaveChangesAsync();
}
