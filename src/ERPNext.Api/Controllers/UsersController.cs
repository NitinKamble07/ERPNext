using ERPNext.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERPNext.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequest req)
        {
            var exists = await _userManager.FindByEmailAsync(req.Email);
            if (exists is not null) return Conflict("User already exists");

            var user = new IdentityUser { Email = req.Email, UserName = req.Email, EmailConfirmed = true };
            var res = await _userManager.CreateAsync(user, req.Password);
            if (!res.Succeeded) return BadRequest(res.Errors.Select(e => e.Description));

            if (req.Roles?.Length > 0)
            {
                foreach (var r in req.Roles)
                {
                    if (!await _roleManager.RoleExistsAsync(r))
                        await _roleManager.CreateAsync(new IdentityRole(r));
                }

                await _userManager.AddToRolesAsync(user, req.Roles);
            }

            return Ok(new CreateUserResponse { UserId = user.Id, Email = user.Email ?? string.Empty, Roles = req.Roles });
        }
    }
}