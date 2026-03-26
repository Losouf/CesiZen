using CesiZen.Dto;

namespace CesiZen.Service;

public interface IGlobalSettingService
{
    Task<IEnumerable<GlobalSettingDto>> GetAllAsync();
    Task<GlobalSettingDto?> GetByKeyAsync(string key);
    Task<bool> CreateOrUpdateAsync(GlobalSettingDto dto);
    Task<bool> DeleteAsync(string key);
}
