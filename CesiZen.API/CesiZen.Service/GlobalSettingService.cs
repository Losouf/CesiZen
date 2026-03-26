using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class GlobalSettingService : IGlobalSettingService
{
    private readonly IGlobalSettingRepository _repository;

    public GlobalSettingService(IGlobalSettingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<GlobalSettingDto>> GetAllAsync()
    {
        var settings = await _repository.GetAllAsync();
        return settings.Select(s => new GlobalSettingDto
        {
            Key = s.Key,
            Value = s.Value,
            Description = s.Description
        });
    }

    public async Task<GlobalSettingDto?> GetByKeyAsync(string key)
    {
        var setting = await _repository.GetByKeyAsync(key);
        if (setting == null) return null;

        return new GlobalSettingDto
        {
            Key = setting.Key,
            Value = setting.Value,
            Description = setting.Description
        };
    }

    public async Task<bool> CreateOrUpdateAsync(GlobalSettingDto dto)
    {
        var setting = await _repository.GetByKeyAsync(dto.Key);
        if (setting == null)
        {
            setting = new GlobalSetting
            {
                Key = dto.Key,
                Value = dto.Value,
                Description = dto.Description
            };
            await _repository.AddAsync(setting);
        }
        else
        {
            setting.Value = dto.Value;
            setting.Description = dto.Description;
            _repository.Update(setting);
        }

        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string key)
    {
        var setting = await _repository.GetByKeyAsync(key);
        if (setting == null) return false;

        _repository.Delete(setting);
        await _repository.SaveChangesAsync();
        return true;
    }
}
