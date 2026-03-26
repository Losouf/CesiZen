using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IInfoArticleRepository
{
    Task<IEnumerable<InfoArticle>> GetAllAsync();
    Task<InfoArticle?> GetByIdAsync(int id);
    Task AddAsync(InfoArticle article);
    void Update(InfoArticle article);
    void Delete(InfoArticle article);
    Task SaveChangesAsync();
}
