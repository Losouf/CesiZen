using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class PermissionRepository : IPermissionRepository
{
    private readonly CesiZenContext _context;

    public PermissionRepository(CesiZenContext context) => _context = context;

    public async Task<IEnumerable<Permission>> GetAllAsync()
        => await _context.Permissions.OrderBy(p => p.Label).ToListAsync();

    public async Task<Permission?> GetByIdAsync(int id)
        => await _context.Permissions.FindAsync(id);

    public async Task<bool> CodeExistsAsync(string code, int? excludeId = null)
        => await _context.Permissions.AnyAsync(p => p.Code == code && (excludeId == null || p.Id != excludeId));

    public async Task AddAsync(Permission permission)
        => await _context.Permissions.AddAsync(permission);

    public void Update(Permission permission) => _context.Permissions.Update(permission);

    public void Delete(Permission permission) => _context.Permissions.Remove(permission);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
