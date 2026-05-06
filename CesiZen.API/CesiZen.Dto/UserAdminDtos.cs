using System;

namespace CesiZen.Dto;

public class AdminUserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? DisplayName { get; set; }
    public string? Role { get; set; }
    public int? RoleId { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class CreateAdminUserDto
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? DisplayName { get; set; }
    public int? RoleId { get; set; }
}

public class UpdateAdminUserDto
{
    public string? DisplayName { get; set; }
    public string? Email { get; set; }
    public int? RoleId { get; set; }
    public string? NewPassword { get; set; }
}
