using Microsoft.EntityFrameworkCore;
using ShoesStore.Models;

namespace ShoesStore.Data
{
    public class ShoesDbContext : DbContext
    {
        public ShoesDbContext(DbContextOptions<ShoesDbContext> options) : base(options) { }

        public DbSet<Shoe> Shoes => Set<Shoe>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Fix decimal precision warnings
            modelBuilder.Entity<Shoe>().Property(s => s.Price).HasPrecision(18, 2);
            modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasPrecision(18, 2);
            modelBuilder.Entity<OrderItem>().Property(oi => oi.UnitPrice).HasPrecision(18, 2);

            // Seed shoe data
            modelBuilder.Entity<Shoe>().HasData(
                new Shoe { Id = 1, Name = "Air Runner", Brand = "Nike", Price = 1299.99m, StockQuantity = 5, Category = "Men", Description = "Lightweight running shoe", ImageUrl = "", IsBestSeller = true },
                new Shoe { Id = 2, Name = "Classic Court", Brand = "Adidas", Price = 999.99m, StockQuantity = 10, Category = "Women", Description = "Classic everyday sneaker", ImageUrl = "", IsBestSeller = false }
            );

            // Unique email constraint for users
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}