using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NNews.ACL.Interfaces;
using NNews.DTO;

namespace DevBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryClient _categoryClient;

    public CategoriesController(ICategoryClient categoryClient)
    {
        _categoryClient = categoryClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var result = await _categoryClient.GetAllAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct = default)
    {
        var result = await _categoryClient.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryInfo category, CancellationToken ct = default)
    {
        var result = await _categoryClient.CreateAsync(category, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] CategoryInfo category, CancellationToken ct = default)
    {
        var result = await _categoryClient.UpdateAsync(category, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct = default)
    {
        await _categoryClient.DeleteAsync(id, ct);
        return NoContent();
    }
}
