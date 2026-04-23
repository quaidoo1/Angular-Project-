using Microsoft.EntityFrameworkCore;
using ShoesStore.Models;
namespace ShoesStore.Data
{
   public class ShoesDbContext : DbContext
   {
       public ShoesDbContext(DbContextOptions<ShoesDbContext> options) : base(options) { }
       public DbSet<Shoe> Shoes => Set<Shoe>();
       public DbSet<Cart> Carts => Set<Cart>();
       public DbSet<CartItem> CartItems => Set<CartItem>();
       public DbSet<Order> Orders => Set<Order>();
       public DbSet<OrderItem> OrderItems => Set<OrderItem>();
       protected override void OnModelCreating(ModelBuilder modelBuilder)
       {
           // Seed data (updated with new fields)
           modelBuilder.Entity<Shoe>().HasData(
               new Shoe
               {
                   Id = 1,
                   Name = "Air Runner",
                   Brand = "Nike",
                   Price = 1299.99m,
                   Category = "Men",
                   ImageUrl = "",
                   Description = "Lightweight running shoe",
                   IsBestSeller = true,
                   StockQuantity = 50
               },
               new Shoe
               {
                   Id = 2,
                   Name = "Classic Court",
                   Brand = "Adidas",
                   Price = 999.99m,
                   Category = "Women",
                   ImageUrl = "",
                   Description = "Classic everyday sneaker",
                   IsBestSeller = false,
                   StockQuantity = 30
               }
           );
           // Cart → CartItems relationship
           modelBuilder.Entity<CartItem>()
               .HasOne(ci => ci.Cart)
               .WithMany(c => c.Items)
               .HasForeignKey(ci => ci.CartId)
               .OnDelete(DeleteBehavior.Cascade);
           // Order → OrderItems relationship
           modelBuilder.Entity<OrderItem>()
               .HasOne(oi => oi.Order)
               .WithMany(o => o.Items)
               .HasForeignKey(oi => oi.OrderId)
               .OnDelete(DeleteBehavior.Cascade);
           // CartItem → Shoe (no cascade to avoid multiple cascade paths)
           modelBuilder.Entity<CartItem>()
               .HasOne(ci => ci.Shoe)
               .WithMany()
               .HasForeignKey(ci => ci.ShoeId)
               .OnDelete(DeleteBehavior.Restrict);
           // OrderItem → Shoe (no cascade)
           modelBuilder.Entity<OrderItem>()
               .HasOne(oi => oi.Shoe)
               .WithMany()
               .HasForeignKey(oi => oi.ShoeId)
               .OnDelete(DeleteBehavior.Restrict);
       }
   }
}