using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class JournalEntryService : IJournalEntryService
{
    private readonly IJournalEntryRepository _repository;

    public JournalEntryService(IJournalEntryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<JournalEntryDto>> GetAllAsync(int? userId = null)
    {
        var entries = await _repository.GetAllAsync(userId);
        return entries.Select(MapToDto);
    }

    public async Task<JournalEntryDto?> GetByIdAsync(int id)
    {
        var entry = await _repository.GetByIdAsync(id);
        return entry == null ? null : MapToDto(entry);
    }

    public async Task<JournalEntryDto> CreateAsync(CreateJournalEntryDto dto)
    {
        var entry = new JournalEntry
        {
            Content = dto.Content,
            UserId = dto.UserId,
            EmotionId = dto.EmotionId,
            LoggedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(entry);
        await _repository.SaveChangesAsync();

        return MapToDto(entry);
    }

    public async Task<bool> UpdateAsync(int id, UpdateJournalEntryDto dto)
    {
        var entry = await _repository.GetByIdAsync(id);
        if (entry == null) return false;

        entry.Content = dto.Content;
        entry.EmotionId = dto.EmotionId;

        _repository.Update(entry);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entry = await _repository.GetByIdAsync(id);
        if (entry == null) return false;

        _repository.Delete(entry);
        await _repository.SaveChangesAsync();
        return true;
    }

    private JournalEntryDto MapToDto(JournalEntry entry)
    {
        return new JournalEntryDto
        {
            Id = entry.Id,
            LoggedAt = entry.LoggedAt,
            Content = entry.Content,
            UserId = entry.UserId,
            EmotionId = entry.EmotionId,
            EmotionLabel = entry.Emotion?.Label
        };
    }
}
