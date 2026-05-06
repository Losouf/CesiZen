using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdAsync(int id);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
    Task AddAsync(User user);
    void Update(User user);
    void Delete(User user);
    Task SaveChangesAsync();
}
