using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesStore.Models

{

    public enum OrderStatus

    {

        Pending,

        Confirmed,

        Shipped,

        Delivered,

        Cancelled

    }

    public class Order

    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string CustomerEmail { get; set; } = string.Empty;

        public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Column(TypeName = "decimal(18,2)")]

        public decimal TotalAmount { get; set; }

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    }

    public class OrderItem

    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        public int OrderId { get; set; }

        [ForeignKey("OrderId")]

        public Order Order { get; set; } = null!;

        public int ShoeId { get; set; }

        [ForeignKey("ShoeId")]

        public Shoe Shoe { get; set; } = null!;

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]

        public decimal UnitPrice { get; set; } // snapshot of price at time of order

    }

}
 