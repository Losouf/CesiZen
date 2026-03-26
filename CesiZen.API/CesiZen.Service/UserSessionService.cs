using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public interface IUserSessionService
{
    Task<IEnumerable<UserSessionDto>> GetAllAsync(int? userId = null);
    Task<bool> RevokeAsync(int id);
    Task<bool> DeleteAsync(int id);
}

public class UserSessionService : IUserSessionService
{
    private readonly IUserSessionRepository _repository;

    public UserSessionService(IUserSessionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<UserSessionDto>> GetAllAsync(int? userId = null)
    {
        var sessions = await _repository.GetAllAsync(userId);
        return sessions.Select(s => new UserSessionDto
        {
            Id = s.Id,
            JwtId = s.JwtId,
            IsRevoked = s.IsRevoked,
            CreatedAt = s.CreatedAt,
            ExpiresAt = s.ExpiresAt,
            UserId = s.UserId
        });
    }

    public async Task<bool> RevokeAsync(int id)
    {
        var session = await _repository.GetByIdAsync(id);
        if (session == null) return false;
        session.IsRevoked = true;
        _repository.Update(session);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var session = await _repository.GetByIdAsync(id);
        if (session == null) return false;
        _repository.Delete(session);
        await _repository.SaveChangesAsync();
        return true;
    }
}
