using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesStore.Data;
using ShoesStore.Models;

namespace ShoesStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ShoesDbContext _context;
        public OrderController(ShoesDbContext context) => _context = context;

        // GET: api/order
        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetAll()
            => await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Shoe)
                .OrderByDescending(o => o.OrderedAt)
                .ToListAsync();

        // GET: api/order/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Items)
                    .ThenInclude(i => i.Shoe)
                .FirstOrDefaultAsync(o => o.Id == id);

            return order is null ? NotFound() : order;
        }

        // POST: api/order/place/{sessionId}
        [HttpPost("place/{sessionId}")]
        public async Task<ActionResult<Order>> PlaceOrder(string sessionId, [FromBody] PlaceOrderRequest request)
        {
            // Use a transaction so stock deduction and order creation are atomic
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Get cart with items
                var cart = await _context.Carts
                    .Include(c => c.Items)
                        .ThenInclude(i => i.Shoe)
                    .FirstOrDefaultAsync(c => c.SessionId == sessionId);

                if (cart is null || !cart.Items.Any())
                    return BadRequest("Cart is empty");

                // Validate stock for all items first
                foreach (var item in cart.Items)
                {
                    if (item.Shoe.StockQuantity < item.Quantity)
                        return BadRequest($"Not enough stock for {item.Shoe.Name}. Only {item.Shoe.StockQuantity} left.");
                }

                // Create order
                var order = new Order
                {
                    CustomerName = request.CustomerName,
                    CustomerEmail = request.CustomerEmail,
                    OrderedAt = DateTime.UtcNow,
                    Status = OrderStatus.Pending
                };

                // Add order items and deduct stock
                decimal total = 0;
                foreach (var item in cart.Items)
                {
                    order.Items.Add(new OrderItem
                    {
                        ShoeId = item.ShoeId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Shoe.Price
                    });

                    // Deduct stock
                    item.Shoe.StockQuantity -= item.Quantity;
                    total += item.Shoe.Price * item.Quantity;
                }

                order.TotalAmount = total;

                _context.Orders.Add(order);

                // Clear the cart after order
                _context.CartItems.RemoveRange(cart.Items);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Order failed: {ex.Message}");
            }
        }

        // PUT: api/order/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order is null) return NotFound();

            order.Status = request.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public record PlaceOrderRequest(string CustomerName, string CustomerEmail);
    public record UpdateStatusRequest(OrderStatus Status);
}
