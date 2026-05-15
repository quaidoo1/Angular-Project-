namespace ShoesStore.Models
{
    public record OrderRequestDto(List<OrderItemRequestDto> Items);
    public record OrderItemRequestDto(int ShoeId, int Quantity);
}
