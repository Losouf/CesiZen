using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class InfoArticleRepository : IInfoArticleRepository
{
    private readonly CesiZenContext _context;

    public InfoArticleRepository(CesiZenContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InfoArticle>> GetAllAsync()
    {
        return await _context.InfoArticles
            .Include(a => a.Author)
            .Include(a => a.FavoriteArticles)
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync();
    }

    public async Task<InfoArticle?> GetByIdAsync(int id)
    {
        return await _context.InfoArticles
            .Include(a => a.Author)
            .Include(a => a.FavoriteArticles)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task AddAsync(InfoArticle article)
    {
        await _context.InfoArticles.AddAsync(article);
    }

    public void Update(InfoArticle article)
    {
        _context.InfoArticles.Update(article);
    }

    public void Delete(InfoArticle article)
    {
        _context.InfoArticles.Remove(article);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
