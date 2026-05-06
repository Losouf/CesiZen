using CesiZen.Data.CesiZen.Model;
using CesiZen.Dto;
using CesiZen.Repository;

namespace CesiZen.Service;

public class PermissionService : IPermissionService
{
    private readonly IPermissionRepository _repository;

    public PermissionService(IPermissionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PermissionDto>> GetAllAsync()
    {
        var perms = await _repository.GetAllAsync();
        return perms.Select(MapToDto);
    }

    public async Task<PermissionDto?> GetByIdAsync(int id)
    {
        var perm = await _repository.GetByIdAsync(id);
        return perm == null ? null : MapToDto(perm);
    }

    public async Task<(PermissionDto? permission, string? error)> CreateAsync(CreatePermissionDto dto)
    {
        if (await _repository.CodeExistsAsync(dto.Code))
            return (null, "Ce code de permission existe déjà");

        var perm = new Permission { Label = dto.Label, Code = dto.Code };
        await _repository.AddAsync(perm);
        await _repository.SaveChangesAsync();
        return (MapToDto(perm), null);
    }

    public async Task<(bool ok, string? error)> UpdateAsync(int id, UpdatePermissionDto dto)
    {
        var perm = await _repository.GetByIdAsync(id);
        if (perm == null) return (false, null);

        if (await _repository.CodeExistsAsync(dto.Code, excludeId: id))
            return (false, "Ce code de permission existe déjà");

        perm.Label = dto.Label;
        perm.Code = dto.Code;
        _repository.Update(perm);
        await _repository.SaveChangesAsync();
        return (true, null);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var perm = await _repository.GetByIdAsync(id);
        if (perm == null) return false;
        _repository.Delete(perm);
        await _repository.SaveChangesAsync();
        return true;
    }

    private static PermissionDto MapToDto(Permission p)
        => new() { Id = p.Id, Label = p.Label, Code = p.Code };
}
