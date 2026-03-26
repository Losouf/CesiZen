using CesiZen.Data;
using CesiZen.Data.CesiZen.Model;
using Microsoft.EntityFrameworkCore;

namespace CesiZen.Repository;

public class GlobalSettingRepository : IGlobalSettingRepository
{
    private readonly CesiZenContext _context;

    public GlobalSettingRepository(CesiZenContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<GlobalSetting>> GetAllAsync()
    {
        return await _context.GlobalSettings.ToListAsync();
    }

    public async Task<GlobalSetting?> GetByKeyAsync(string key)
    {
        return await _context.GlobalSettings.FirstOrDefaultAsync(s => s.Key == key);
    }

    public async Task AddAsync(GlobalSetting setting)
    {
        await _context.GlobalSettings.AddAsync(setting);
    }

    public void Update(GlobalSetting setting)
    {
        _context.GlobalSettings.Update(setting);
    }

    public void Delete(GlobalSetting setting)
    {
        _context.GlobalSettings.Remove(setting);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
