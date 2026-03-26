using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public interface IEmotionService
{
    Task<IEnumerable<EmotionDto>> GetAllAsync();
    Task<EmotionDto?> GetByIdAsync(int id);
    Task<EmotionDto> CreateAsync(CreateEmotionDto dto);
    Task<bool> UpdateAsync(int id, UpdateEmotionDto dto);
    Task<bool> DeleteAsync(int id);
}
