using Microsoft.AspNetCore.Identity;

namespace ERPNext.Api.Data
{
    public class SeedData
    {
        private readonly string[] _roles = new[] { "Admin", "Agent", "Customer" };

        public async Task InitializeAsync(IServiceProvider services, IConfiguration config)
        {
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = services.GetRequiredService<UserManager<IdentityUser>>();

            foreach (var r in _roles)
            {
                if (!await roleManager.RoleExistsAsync(r))
                {
                    await roleManager.CreateAsync(new IdentityRole(r));
                }
            }

            var adminEmail = config["Seed:AdminEmail"] ?? "admin@erp.local";
            var adminPw = config["Seed:AdminPassword"] ?? "Admin123!";

            var admin = await userManager.FindByEmailAsync(adminEmail);
            if (admin is null)
            {
                admin = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                var res = await userManager.CreateAsync(admin, adminPw);
                if (res.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }
        }
    }
}