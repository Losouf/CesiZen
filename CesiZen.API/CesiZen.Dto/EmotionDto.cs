using System;
using System.Collections.Generic;

namespace CesiZen.Dto;

public class EmotionDto
{
    public int Id { get; set; }
    public string Label { get; set; } = null!;
    public string? Color { get; set; }
    public int? ParentId { get; set; }
    public int? CreatedByUserId { get; set; }
}

public class CreateEmotionDto
{
    public string Label { get; set; } = null!;
    public string? Color { get; set; }
    public int? ParentId { get; set; }
    public int? CreatedByUserId { get; set; }
}

public class UpdateEmotionDto
{
    public string Label { get; set; } = null!;
    public string? Color { get; set; }
    public int? ParentId { get; set; }
}
