using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class JournalEntryRepository : IJournalEntryRepository
{
    private readonly CesiZenContext _context;
    public JournalEntryRepository(CesiZenContext context) => _context = context;

    public async Task<IEnumerable<JournalEntry>> GetAllAsync(int? userId = null)
    {
        var query = _context.JournalEntries.Include(j => j.Emotion).AsQueryable();
        if (userId.HasValue)
        {
            query = query.Where(j => j.UserId == userId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<JournalEntry?> GetByIdAsync(int id)
    {
        return await _context.JournalEntries
            .Include(j => j.Emotion)
            .FirstOrDefaultAsync(j => j.Id == id);
    }

    public async Task AddAsync(JournalEntry entry) => await _context.JournalEntries.AddAsync(entry);

    public void Update(JournalEntry entry) => _context.JournalEntries.Update(entry);

    public void Delete(JournalEntry entry) => _context.JournalEntries.Remove(entry);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
