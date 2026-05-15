using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesStore.Models
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        public int ShoeId { get; set; }
        [ForeignKey("ShoeId")]
        public Shoe? Shoe { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
