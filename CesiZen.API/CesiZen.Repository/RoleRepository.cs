using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class RoleRepository : IRoleRepository
{
    private readonly CesiZenContext _context;
    public RoleRepository(CesiZenContext context) => _context = context;

    public async Task<IEnumerable<Role>> GetAllAsync() => await _context.Roles.ToListAsync();

    public async Task<Role?> GetByIdAsync(int id) => await _context.Roles.FindAsync(id);

    public async Task AddAsync(Role role) => await _context.Roles.AddAsync(role);

    public void Update(Role role) => _context.Roles.Update(role);

    public void Delete(Role role) => _context.Roles.Remove(role);

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
        => await _context.Permissions.OrderBy(p => p.Label).ToListAsync();

    public async Task<IEnumerable<Permission>> GetPermissionsForRoleAsync(int roleId)
    {
        return await _context.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .Include(rp => rp.Permission)
            .Select(rp => rp.Permission)
            .OrderBy(p => p.Label)
            .ToListAsync();
    }

    public async Task<bool> AddPermissionToRoleAsync(int roleId, int permissionId)
    {
        var roleExists = await _context.Roles.AnyAsync(r => r.Id == roleId);
        var permExists = await _context.Permissions.AnyAsync(p => p.Id == permissionId);
        if (!roleExists || !permExists) return false;

        var alreadyLinked = await _context.RolePermissions
            .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        if (alreadyLinked) return true;

        await _context.RolePermissions.AddAsync(new RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId
        });
        return true;
    }

    public async Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId)
    {
        var link = await _context.RolePermissions
            .FirstOrDefaultAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        if (link == null) return false;
        _context.RolePermissions.Remove(link);
        return true;
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
