using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesStore.Data;
using ShoesStore.Models;

namespace ShoesStore.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ShoesController : ControllerBase
    {
        private readonly ShoesDbContext _context;
        public ShoesController(ShoesDbContext context) => _context = context;

        // GET: api/shoes
        [HttpGet]
        public async Task<ActionResult<List<Shoe>>> GetAll()
            => await _context.Shoes.ToListAsync();

        // GET: api/shoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shoe>> GetById(int id)
        {
            var shoe = await _context.Shoes.FindAsync(id);
            return shoe is null ? NotFound() : shoe;
        }

        [HttpPost]
        public async Task<ActionResult<Shoe>> Create(Shoe shoe)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Shoes.Add(shoe);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return CreatedAtAction(nameof(GetById), new { id = shoe.Id }, shoe);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred during transaction.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Shoe updated)
        {
            if (id != updated.Id) return BadRequest("ID mismatch");

            var exists = await _context.Shoes.AnyAsync(s => s.Id == id);
            if (!exists) return NotFound();

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Entry(updated).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred during transaction.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var shoe = await _context.Shoes.FindAsync(id);
            if (shoe is null) return NotFound();

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Shoes.Remove(shoe);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred during transaction.", error = ex.Message });
            }
        }
    }
}