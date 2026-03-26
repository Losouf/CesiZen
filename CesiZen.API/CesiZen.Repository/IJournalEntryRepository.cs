using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IJournalEntryRepository
{
    Task<IEnumerable<JournalEntry>> GetAllAsync(int? userId = null);
    Task<JournalEntry?> GetByIdAsync(int id);
    Task AddAsync(JournalEntry entry);
    void Update(JournalEntry entry);
    void Delete(JournalEntry entry);
    Task SaveChangesAsync();
}
