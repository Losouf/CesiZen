using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IUserSessionRepository
{
    Task<IEnumerable<UserSession>> GetAllAsync(int? userId = null);
    Task<UserSession?> GetByIdAsync(int id);
    void Update(UserSession session);
    void Delete(UserSession session);
    Task SaveChangesAsync();
}
