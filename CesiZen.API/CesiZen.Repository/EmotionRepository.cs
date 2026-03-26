using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class EmotionRepository : IEmotionRepository
{
    private readonly CesiZenContext _context;
    public EmotionRepository(CesiZenContext context) => _context = context;

    public async Task<IEnumerable<Emotion>> GetAllAsync() => await _context.Emotions.ToListAsync();

    public async Task<Emotion?> GetByIdAsync(int id) => await _context.Emotions.FindAsync(id);

    public async Task AddAsync(Emotion emotion) => await _context.Emotions.AddAsync(emotion);

    public void Update(Emotion emotion) => _context.Emotions.Update(emotion);

    public void Delete(Emotion emotion) => _context.Emotions.Remove(emotion);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
