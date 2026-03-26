using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class InfoArticleService : IInfoArticleService
{
    private readonly IInfoArticleRepository _repository;

    public InfoArticleService(IInfoArticleRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<InfoArticleDto>> GetAllAsync()
    {
        var articles = await _repository.GetAllAsync();
        return articles.Select(a => MapToDto(a));
    }

    public async Task<InfoArticleDto?> GetByIdAsync(int id)
    {
        var article = await _repository.GetByIdAsync(id);
        if (article == null) return null;
        return MapToDto(article);
    }

    public async Task<InfoArticleDto> CreateAsync(CreateInfoArticleDto dto)
    {
        var article = new InfoArticle
        {
            Title = dto.Title,
            Body = dto.Body,
            AuthorId = dto.AuthorId,
            PublishedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(article);
        await _repository.SaveChangesAsync();

        // Reload to get author info
        var savedArticle = await _repository.GetByIdAsync(article.Id);
        return MapToDto(savedArticle!);
    }

    public async Task<bool> UpdateAsync(int id, UpdateInfoArticleDto dto)
    {
        var article = await _repository.GetByIdAsync(id);
        if (article == null) return false;

        article.Title = dto.Title;
        article.Body = dto.Body;

        _repository.Update(article);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var article = await _repository.GetByIdAsync(id);
        if (article == null) return false;

        _repository.Delete(article);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static InfoArticleDto MapToDto(InfoArticle a)
    {
        return new InfoArticleDto
        {
            Id = a.Id,
            Title = a.Title,
            Body = a.Body,
            PublishedAt = a.PublishedAt,
            AuthorId = a.AuthorId,
            AuthorName = a.Author?.DisplayName ?? a.Author?.Username
        };
    }
}
