using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesStore.Data;
using ShoesStore.Models;
using System.Security.Claims;

namespace ShoesStore.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ShoesDbContext _context;

        public OrdersController(ShoesDbContext context) => _context = context;

        [HttpPost("purchase")]
        public async Task<IActionResult> Purchase(OrderRequestDto request)
        {
            if (request.Items == null || !request.Items.Any())
                return BadRequest("Empty order.");

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out int userId))
                return Unauthorized("User ID not found in token.");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.UtcNow,
                    TotalAmount = 0
                };

                _context.Orders.Add(order);
                // Save changes to generate Order Id
                await _context.SaveChangesAsync();

                decimal total = 0;

                foreach (var itemReq in request.Items)
                {
                    var shoe = await _context.Shoes.FindAsync(itemReq.ShoeId);
                    
                    if (shoe == null)
                        throw new Exception($"Shoe with ID {itemReq.ShoeId} not found.");

                    if (shoe.StockQuantity < itemReq.Quantity)
                        throw new Exception($"Insufficient stock for {shoe.Name}. Available: {shoe.StockQuantity}, Requested: {itemReq.Quantity}.");

                    // Deduct stock
                    shoe.StockQuantity -= itemReq.Quantity;

                    var itemPrice = shoe.Price;
                    total += itemPrice * itemReq.Quantity;

                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.Id,
                        ShoeId = shoe.Id,
                        Quantity = itemReq.Quantity,
                        UnitPrice = itemPrice
                    });
                }

                order.TotalAmount = total;
                _context.Orders.Update(order);
                _context.Shoes.UpdateRange();

                await _context.SaveChangesAsync();
                
                // CRUCIAL: commit the transaction ensures atomically updating stock and creating orders!
                await transaction.CommitAsync();

                return Ok(new { message = "Order successfully created!", orderId = order.Id, totalAmount = total });
            }
            catch (Exception ex)
            {
                // Revert any stock changes and remove partial order inserts if it failed anywhere!
                await transaction.RollbackAsync();
                return BadRequest(new { message = "Transaction failed.", error = ex.Message });
            }
        }
    }
}
