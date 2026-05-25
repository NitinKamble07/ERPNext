using Microsoft.AspNetCore.Identity;

namespace ERPNext.Api.Services
{
    public interface ITokenService
    {
        Task<string> CreateTokenAsync(IdentityUser user);
    }
}