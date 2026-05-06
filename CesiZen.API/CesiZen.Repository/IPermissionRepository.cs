using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IPermissionRepository
{
    Task<IEnumerable<Permission>> GetAllAsync();
    Task<Permission?> GetByIdAsync(int id);
    Task<bool> CodeExistsAsync(string code, int? excludeId = null);
    Task AddAsync(Permission permission);
    void Update(Permission permission);
    void Delete(Permission permission);
    Task SaveChangesAsync();
}
