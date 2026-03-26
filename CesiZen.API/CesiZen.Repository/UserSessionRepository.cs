using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class UserSessionRepository : IUserSessionRepository
{
    private readonly CesiZenContext _context;
    public UserSessionRepository(CesiZenContext context) => _context = context;

    public async Task<IEnumerable<UserSession>> GetAllAsync(int? userId = null)
    {
        var query = _context.UserSessions.AsQueryable();
        if (userId.HasValue)
        {
            query = query.Where(s => s.UserId == userId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<UserSession?> GetByIdAsync(int id) => await _context.UserSessions.FindAsync(id);

    public void Update(UserSession session) => _context.UserSessions.Update(session);

    public void Delete(UserSession session) => _context.UserSessions.Remove(session);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
