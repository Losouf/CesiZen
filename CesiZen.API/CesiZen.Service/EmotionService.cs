using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class EmotionService : IEmotionService
{
    private readonly IEmotionRepository _repository;

    public EmotionService(IEmotionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmotionDto>> GetAllAsync()
    {
        var emotions = await _repository.GetAllAsync();
        return emotions.Select(MapToDto);
    }

    public async Task<EmotionDto?> GetByIdAsync(int id)
    {
        var emotion = await _repository.GetByIdAsync(id);
        return emotion == null ? null : MapToDto(emotion);
    }

    public async Task<EmotionDto> CreateAsync(CreateEmotionDto dto)
    {
        var emotion = new Emotion
        {
            Label = dto.Label,
            Color = dto.Color,
            ParentId = dto.ParentId,
            CreatedByUserId = dto.CreatedByUserId
        };

        await _repository.AddAsync(emotion);
        await _repository.SaveChangesAsync();

        return MapToDto(emotion);
    }

    public async Task<bool> UpdateAsync(int id, UpdateEmotionDto dto)
    {
        var emotion = await _repository.GetByIdAsync(id);
        if (emotion == null) return false;

        emotion.Label = dto.Label;
        emotion.Color = dto.Color;
        emotion.ParentId = dto.ParentId;

        _repository.Update(emotion);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var emotion = await _repository.GetByIdAsync(id);
        if (emotion == null) return false;

        _repository.Delete(emotion);
        await _repository.SaveChangesAsync();
        return true;
    }

    private EmotionDto MapToDto(Emotion emotion)
    {
        return new EmotionDto
        {
            Id = emotion.Id,
            Label = emotion.Label,
            Color = emotion.Color,
            ParentId = emotion.ParentId,
            CreatedByUserId = emotion.CreatedByUserId
        };
    }
}
