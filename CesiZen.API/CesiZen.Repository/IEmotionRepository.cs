using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IEmotionRepository
{
    Task<IEnumerable<Emotion>> GetAllAsync();
    Task<Emotion?> GetByIdAsync(int id);
    Task AddAsync(Emotion emotion);
    void Update(Emotion emotion);
    void Delete(Emotion emotion);
    Task SaveChangesAsync();
}
