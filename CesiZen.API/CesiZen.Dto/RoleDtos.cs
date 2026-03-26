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
