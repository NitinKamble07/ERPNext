using ERPNext.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ERPNext.Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products => Set<Product>();
        public DbSet<WorkOrder> WorkOrders => Set<WorkOrder>();
        public DbSet<LoginAttempt> LoginAttempts => Set<LoginAttempt>();
        public DbSet<ItemMaster> ItemMaster => Set<ItemMaster>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Sku).IsRequired();
                b.Property(x => x.Name).IsRequired();
            });

            builder.Entity<WorkOrder>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Number).IsRequired();
                b.HasOne(x => x.Product).WithMany();
            });

            builder.Entity<LoginAttempt>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.Email).HasMaxLength(256);
                b.Property(x => x.IpAddress).HasMaxLength(64);
                b.Property(x => x.UserAgent).HasMaxLength(1024);
            });

            builder.Entity<ItemMaster>(b =>
            {
                b.HasKey(x => x.Id);
                b.Property(x => x.ItemName).IsRequired();
                b.Property(x => x.BrandName).IsRequired(false);
                b.Property(x => x.CreatedBy).HasMaxLength(450).IsRequired(false);
                b.Property(x => x.UpdatedBy).HasMaxLength(450).IsRequired(false);
                b.Property(x => x.DeletedBy).HasMaxLength(450).IsRequired(false);
            });
        }
    }
}