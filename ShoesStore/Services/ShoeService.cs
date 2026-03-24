using ShoesStore.Models;

namespace ShoesStore.Services;

public static class ShoeService
{
    private static List<Shoe> shoes = new List<Shoe>
    {
        new Shoe { Id = 1, Name = "Nike Air", Price = 850 },
        new Shoe { Id = 2, Name = "Adidas Run", Price = 780 }
    };

    public static List<Shoe> GetAll() => shoes;

    public static Shoe? GetById(int id) =>
        shoes.FirstOrDefault(s => s.Id == id);

    public static void Add(Shoe shoe)
    {
        shoe.Id = shoes.Max(s => s.Id) + 1;
        shoes.Add(shoe);
    }

    public static void Update(int id, Shoe updatedShoe)
    {
        var index = shoes.FindIndex(s => s.Id == id);
        if (index != -1)
        {
            updatedShoe.Id = id;
            shoes[index] = updatedShoe;
        }
    }

    public static void Delete(int id)
    {
        var shoe = GetById(id);
        if (shoe != null)
        {
            shoes.Remove(shoe);
        }
    }
}