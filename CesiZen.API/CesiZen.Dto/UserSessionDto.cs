using System;

namespace CesiZen.Dto;

public class UserSessionDto
{
    public int Id { get; set; }
    public string JwtId { get; set; } = null!;
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public int UserId { get; set; }
}
