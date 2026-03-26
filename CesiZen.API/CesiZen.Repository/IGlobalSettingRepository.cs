using CesiZen.Data.CesiZen.Model;

namespace CesiZen.Repository;

public interface IGlobalSettingRepository
{
    Task<IEnumerable<GlobalSetting>> GetAllAsync();
    Task<GlobalSetting?> GetByKeyAsync(string key);
    Task AddAsync(GlobalSetting setting);
    void Update(GlobalSetting setting);
    void Delete(GlobalSetting setting);
    Task SaveChangesAsync();
}
