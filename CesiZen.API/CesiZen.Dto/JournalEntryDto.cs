using System;

namespace CesiZen.Dto;

public class JournalEntryDto
{
    public int Id { get; set; }
    public DateTime LoggedAt { get; set; }
    public string Content { get; set; } = null!;
    public int UserId { get; set; }
    public int EmotionId { get; set; }
    public string? EmotionLabel { get; set; }
}

public class CreateJournalEntryDto
{
    public string Content { get; set; } = null!;
    public int UserId { get; set; }
    public int EmotionId { get; set; }
    public int Intensity { get; set; }
}

public class UpdateJournalEntryDto
{
    public string Content { get; set; } = null!;
    public int EmotionId { get; set; }
    public int Intensity { get; set; }
}
