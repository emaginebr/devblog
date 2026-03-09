using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NAuth.ACL.Interfaces;
using NAuth.DTO;

namespace DevBlog.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserClient _userClient;
    private readonly IRoleClient _roleClient;

    public AuthController(IUserClient userClient, IRoleClient roleClient)
    {
        _userClient = userClient;
        _roleClient = roleClient;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginParam param)
    {
        var result = await _userClient.LoginWithEmailAsync(param);
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserInsertedInfo param)
    {
        var result = await _userClient.InsertAsync(param);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var user = _userClient.GetUserInSession(HttpContext);
        return Ok(user);
    }

    [Authorize]
    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetUserById(long id)
    {
        var user = await _userClient.GetByIdAsync(id);
        return Ok(user);
    }

    [Authorize]
    [HttpPut("user")]
    public async Task<IActionResult> UpdateUser([FromBody] UserInfo param)
    {
        var result = await _userClient.UpdateAsync(param);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordParam param)
    {
        var result = await _userClient.ChangePasswordAsync(param);
        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var result = await _userClient.SendRecoveryMailAsync(request.Email);
        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ChangePasswordUsingHashParam param)
    {
        var result = await _userClient.ChangePasswordUsingHashAsync(param);
        return Ok(result);
    }

    [Authorize]
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        var result = await _userClient.UploadImageUserAsync(file);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("users")]
    public async Task<IActionResult> ListUsers([FromQuery] UserSearchParam param)
    {
        var result = await _userClient.ListAsync(param);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("roles")]
    public async Task<IActionResult> ListRoles()
    {
        var result = await _roleClient.ListAsync();
        return Ok(result);
    }
}

public class ForgotPasswordRequest
{
    public string Email { get; set; } = string.Empty;
}
