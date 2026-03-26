using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdAsync(int id);
    Task AddAsync(User user);
    void Update(User user);
    Task SaveChangesAsync();
}
