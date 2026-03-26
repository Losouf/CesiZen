using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public interface IJournalEntryService
{
    Task<IEnumerable<JournalEntryDto>> GetAllAsync(int? userId = null);
    Task<JournalEntryDto?> GetByIdAsync(int id);
    Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto dto);
    Task<bool> UpdateAsync(int id, UpdateJournalEntryDto dto);
    Task<bool> DeleteAsync(int id);
}
