using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesStore.Data;
using ShoesStore.Models;

namespace ShoesStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ShoesDbContext _context;
        public CartController(ShoesDbContext context) => _context = context;

        // GET: api/cart/{sessionId}
        [HttpGet("{sessionId}")]
        public async Task<ActionResult<Cart>> GetCart(string sessionId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Shoe)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            if (cart is null)
                return NotFound("Cart not found");

            return cart;
        }

        // POST: api/cart/{sessionId}/add
        [HttpPost("{sessionId}/add")]
        public async Task<ActionResult<Cart>> AddToCart(string sessionId, [FromBody] AddToCartRequest request)
        {
            // Check shoe exists and has stock
            var shoe = await _context.Shoes.FindAsync(request.ShoeId);
            if (shoe is null) return NotFound("Shoe not found");
            if (shoe.StockQuantity < request.Quantity)
                return BadRequest($"Only {shoe.StockQuantity} items left in stock");

            // Get or create cart
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            if (cart is null)
            {
                cart = new Cart { SessionId = sessionId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Check if shoe already in cart
            var existingItem = cart.Items.FirstOrDefault(i => i.ShoeId == request.ShoeId);
            if (existingItem is not null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    CartId = cart.Id,
                    ShoeId = request.ShoeId,
                    Quantity = request.Quantity
                });
            }

            await _context.SaveChangesAsync();

            // Return updated cart with shoe details
            return await GetCart(sessionId) as ActionResult<Cart>;
        }

        // PUT: api/cart/{sessionId}/update/{cartItemId}
        [HttpPut("{sessionId}/update/{cartItemId}")]
        public async Task<IActionResult> UpdateQuantity(string sessionId, int cartItemId, [FromBody] UpdateCartRequest request)
        {
            var item = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart.SessionId == sessionId);

            if (item is null) return NotFound("Cart item not found");

            if (request.Quantity <= 0)
            {
                _context.CartItems.Remove(item);
            }
            else
            {
                var shoe = await _context.Shoes.FindAsync(item.ShoeId);
                if (shoe!.StockQuantity < request.Quantity)
                    return BadRequest($"Only {shoe.StockQuantity} items left in stock");

                item.Quantity = request.Quantity;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart/{sessionId}/remove/{cartItemId}
        [HttpDelete("{sessionId}/remove/{cartItemId}")]
        public async Task<IActionResult> RemoveItem(string sessionId, int cartItemId)
        {
            var item = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == cartItemId && i.Cart.SessionId == sessionId);

            if (item is null) return NotFound("Cart item not found");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/cart/{sessionId}/clear
        [HttpDelete("{sessionId}/clear")]
        public async Task<IActionResult> ClearCart(string sessionId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.SessionId == sessionId);

            if (cart is null) return NotFound();

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public record AddToCartRequest(int ShoeId, int Quantity);
    public record UpdateCartRequest(int Quantity);
}