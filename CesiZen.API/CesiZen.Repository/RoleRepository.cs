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

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync() => await _context.Permissions.ToListAsync();

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
