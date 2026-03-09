using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NNews.ACL.Interfaces;
using NNews.DTO;

namespace DevBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleClient _articleClient;
    private readonly IArticleAIClient _articleAIClient;
    private readonly IImageClient _imageClient;

    public ArticlesController(
        IArticleClient articleClient,
        IArticleAIClient articleAIClient,
        IImageClient imageClient)
    {
        _articleClient = articleClient;
        _articleAIClient = articleAIClient;
        _imageClient = imageClient;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] long? categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _articleClient.GetAllAsync(categoryId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(
        long categoryId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _articleClient.ListByCategoryAsync(categoryId, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("tag/{tagSlug}")]
    public async Task<IActionResult> GetByTag(
        string tagSlug,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _articleClient.ListByTagAsync(tagSlug, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string keyword,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _articleClient.SearchAsync(keyword, page, pageSize, ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken ct = default)
    {
        var result = await _articleClient.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ArticleInsertedInfo article, CancellationToken ct = default)
    {
        var result = await _articleClient.CreateAsync(article, ct);
        return CreatedAtAction(nameof(GetById), new { id = result }, result);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ArticleUpdatedInfo article, CancellationToken ct = default)
    {
        var result = await _articleClient.UpdateAsync(article, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("ai/create")]
    public async Task<IActionResult> CreateWithAI(
        [FromQuery] string prompt,
        [FromQuery] bool generateImage = false,
        CancellationToken ct = default)
    {
        var result = await _articleAIClient.CreateWithAIAsync(prompt, generateImage, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("ai/update/{articleId}")]
    public async Task<IActionResult> UpdateWithAI(
        int articleId,
        [FromQuery] string prompt,
        [FromQuery] bool generateImage = false,
        CancellationToken ct = default)
    {
        var result = await _articleAIClient.UpdateWithAIAsync(articleId, prompt, generateImage, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file, CancellationToken ct = default)
    {
        var result = await _imageClient.UploadImageAsync(file, ct);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("by-roles")]
    public async Task<IActionResult> GetByRoles(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        var result = await _articleClient.ListByRolesAsync(page, pageSize, ct);
        return Ok(result);
    }
}
