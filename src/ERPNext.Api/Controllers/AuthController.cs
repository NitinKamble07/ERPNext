using ERPNext.Api.Models;
using ERPNext.Api.Services;
using ERPNext.Core.Entities;
using ERPNext.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ERPNext.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ITokenService _token_service;
        private readonly ApplicationDbContext _db;

        public AuthController(UserManager<IdentityUser> userManager, ITokenService tokenService, ApplicationDbContext db)
        {
            _userManager = userManager;
            _token_service = tokenService;
            _db = db;
        }

        // Provide a friendly GET so opening the register URL in a browser doesn't return 405
        [HttpGet]
        [HttpGet("Get")]
        public IActionResult Get()
        {
            return Ok(new
            {
                message = "Auth endpoints: POST /api/Auth/register and POST /api/Auth/login. Use Swagger at /swagger for interactive testing."
            });
        }

        [HttpGet("register")]
        public IActionResult RegisterInfo()
        {
            return Ok(new
            {
                message = "POST JSON { \"email\": \"you@example.com\", \"password\": \"P@ssw0rd\" } to this URL to register. Use Swagger at /swagger for an interactive UI."
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            var user = new IdentityUser { UserName = req.Email, Email = req.Email };
            var res = await _userManager.CreateAsync(user, req.Password);

            var attempt = new LoginAttempt { Email = req.Email, Succeeded = res.Succeeded, AttemptedAt = DateTime.UtcNow, IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() };
            await _db.LoginAttempts.AddAsync(attempt);
            await _db.SaveChangesAsync();

            if (!res.Succeeded)
            {
                return BadRequest(res.Errors.Select(e => e.Description));
            }

            var token = await _token_service.CreateTokenAsync(user);
            return Ok(new AuthResponse { Token = token, ExpiresAt = DateTime.UtcNow.AddHours(8) });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user is null)
            {
                var attemptNotFound = new LoginAttempt { Email = req.Email, Succeeded = false, AttemptedAt = DateTime.UtcNow, IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(), FailureReason = "User not found" };
                await _db.LoginAttempts.AddAsync(attemptNotFound);
                await _db.SaveChangesAsync();
                return Unauthorized();
            }

            var valid = await _userManager.CheckPasswordAsync(user, req.Password);
            var attempt = new LoginAttempt { UserId = user.Id, Email = req.Email, Succeeded = valid, AttemptedAt = DateTime.UtcNow, IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() };
            await _db.LoginAttempts.AddAsync(attempt);
            await _db.SaveChangesAsync();

            if (!valid) return Unauthorized();

            var token = await _token_service.CreateTokenAsync(user);
            return Ok(new AuthResponse { Token = token, ExpiresAt = DateTime.UtcNow.AddHours(8) });
        }

        // Returns current authenticated user's profile. Client must send Authorization: Bearer {token}
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // Try to get user id from claims (NameIdentifier or sub)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(userId))
            {
                // try JWT sub claim
                userId = User.FindFirstValue("sub");
            }

            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                userName = user.UserName,
                roles = roles
            });
        }
    }
}