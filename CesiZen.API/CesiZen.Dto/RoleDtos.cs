using System;
using System.Collections.Generic;

namespace CesiZen.Dto;

public class RoleDto
{
    public int Id { get; set; }
    public string Label { get; set; } = null!;
}

public class PermissionDto
{
    public int Id { get; set; }
    public string Label { get; set; } = null!;
    public string Code { get; set; } = null!;
}

public class CreateRoleDto
{
    public string Label { get; set; } = null!;
}

public class UpdateRoleDto
{
    public string Label { get; set; } = null!;
}

public class CreatePermissionDto
{
    public string Label { get; set; } = null!;
    public string Code { get; set; } = null!;
}

public class UpdatePermissionDto
{
    public string Label { get; set; } = null!;
    public string Code { get; set; } = null!;
}

public class RoleWithPermissionsDto
{
    public int Id { get; set; }
    public string Label { get; set; } = null!;
    public List<PermissionDto> Permissions { get; set; } = new();
}
