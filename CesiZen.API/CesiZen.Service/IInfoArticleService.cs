using CesiZen.Dto;

namespace CesiZen.Service;

public interface IInfoArticleService
{
    Task<IEnumerable<InfoArticleDto>> GetAllAsync(int? userId = null);
    Task<InfoArticleDto?> GetByIdAsync(int id, int? userId = null);
    Task<InfoArticleDto> CreateAsync(CreateInfoArticleDto dto);
    Task<bool> UpdateAsync(int id, UpdateInfoArticleDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> ToggleFavoriteAsync(int userId, int articleId);
}
