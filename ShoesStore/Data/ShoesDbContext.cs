using Microsoft.EntityFrameworkCore;
using ShoesStore.Models;

namespace ShoesStore.Data
{
    public class ShoesDbContext : DbContext
    {
        public ShoesDbContext(DbContextOptions<ShoesDbContext> options) : base(options) { }

        public DbSet<Shoe> Shoes => Set<Shoe>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //  seedING data 
            modelBuilder.Entity<Shoe>().HasData(
                new Shoe { Id = 1, Name = "Air Runner", Brand = "Nike", Price = 1299.99m },
                new Shoe { Id = 2, Name = "Classic Court", Brand = "Adidas", Price = 999.99m }
            );
        }
    }
}