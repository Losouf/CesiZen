using CesiZen.Dto;

namespace CesiZen.Service;

public interface IInfoArticleService
{
    Task<IEnumerable<InfoArticleDto>> GetAllAsync();
    Task<InfoArticleDto?> GetByIdAsync(int id);
    Task<InfoArticleDto> CreateAsync(CreateInfoArticleDto dto);
    Task<bool> UpdateAsync(int id, UpdateInfoArticleDto dto);
    Task<bool> DeleteAsync(int id);
}
