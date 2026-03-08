using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NNews.ACL.Interfaces;
using NNews.DTO;

namespace DevBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly ITagClient _tagClient;

    public TagsController(ITagClient tagClient)
    {
        _tagClient = tagClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var result = await _tagClient.GetAllAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(long id, CancellationToken ct = default)
    {
        var result = await _tagClient.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TagInfo tag, CancellationToken ct = default)
    {
        var result = await _tagClient.CreateAsync(tag, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] TagInfo tag, CancellationToken ct = default)
    {
        var result = await _tagClient.UpdateAsync(tag, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(long id, CancellationToken ct = default)
    {
        await _tagClient.DeleteAsync(id, ct);
        return NoContent();
    }

    [Authorize]
    [HttpPost("merge")]
    public async Task<IActionResult> Merge(
        [FromQuery] long sourceTagId,
        [FromQuery] long targetTagId,
        CancellationToken ct = default)
    {
        await _tagClient.MergeTagsAsync(sourceTagId, targetTagId, ct);
        return NoContent();
    }

    [Authorize]
    [HttpGet("by-roles")]
    public async Task<IActionResult> GetByRoles(CancellationToken ct = default)
    {
        var result = await _tagClient.ListByRolesAsync(ct);
        return Ok(result);
    }
}
