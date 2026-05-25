using System;

namespace ERPNext.Core.Entities
{
    public class LoginAttempt : BaseEntity
    {
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;
        public bool Succeeded { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string? FailureReason { get; set; }
    }
}