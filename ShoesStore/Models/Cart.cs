using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesStore.Models

{

    public class Cart

    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        public string SessionId { get; set; } = string.Empty; // identifies the user's cart

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    }

    public class CartItem

    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        public int CartId { get; set; }

        [ForeignKey("CartId")]

        public Cart Cart { get; set; } = null!;

        public int ShoeId { get; set; }

        [ForeignKey("ShoeId")]

        public Shoe Shoe { get; set; } = null!;

        [Range(1, int.MaxValue)]

        public int Quantity { get; set; } = 1;

    }

}
 