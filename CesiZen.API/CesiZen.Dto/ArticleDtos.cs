using System;

namespace CesiZen.Dto;

public class InfoArticleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Body { get; set; } = null!;
    public DateTime PublishedAt { get; set; }
    public int AuthorId { get; set; }
    public string? AuthorName { get; set; }
}

public class CreateInfoArticleDto
{
    public string Title { get; set; } = null!;
    public string Body { get; set; } = null!;
    public int AuthorId { get; set; }
}

public class UpdateInfoArticleDto
{
    public string Title { get; set; } = null!;
    public string Body { get; set; } = null!;
}
