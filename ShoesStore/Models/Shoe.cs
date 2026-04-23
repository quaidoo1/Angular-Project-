using System.ComponentModel.DataAnnotations;

using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesStore.Models

{

    public class Shoe

    {

        [Key]

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Brand { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public bool IsBestSeller { get; set; } = false;

        [Range(0, int.MaxValue)]

        public int StockQuantity { get; set; } = 0;

    }

}
 