using Microsoft.AspNetCore.Authentication;
using NAuth.ACL;
using NAuth.ACL.Interfaces;
using NAuth.Handler;
using NAuth.DTO.Settings;
using NNews.ACL;
using NNews.ACL.Interfaces;
using NNews.DTO.Settings;
using zTools.ACL;
using zTools.ACL.Interfaces;
using zTools.DTO.Settings;

var builder = WebApplication.CreateBuilder(args);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevBlogCors", policy =>
    {
        policy.WithOrigins(
                builder.Configuration.GetValue<string>("AllowedOrigins") ?? "http://localhost:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Controllers
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// zTools configuration
builder.Services.Configure<zToolsetting>(builder.Configuration.GetSection("zTools"));
builder.Services.AddHttpClient<IChatGPTClient, ChatGPTClient>();
builder.Services.AddHttpClient<IMailClient, MailClient>();
builder.Services.AddHttpClient<IFileClient, FileClient>();
builder.Services.AddHttpClient<IStringClient, StringClient>();

// NAuth configuration
builder.Services.Configure<NAuthSetting>(builder.Configuration.GetSection("NAuth"));
builder.Services.AddHttpClient();
builder.Services.AddScoped<IUserClient, UserClient>();
builder.Services.AddScoped<IRoleClient, RoleClient>();

builder.Services.AddAuthentication("NAuth")
    .AddScheme<AuthenticationSchemeOptions, NAuthHandler>("NAuth", options => { });

builder.Services.AddAuthorization();

// NNews configuration
builder.Services.Configure<NNewsSetting>(builder.Configuration.GetSection("NNews"));
builder.Services.AddHttpClient<IArticleClient, ArticleClient>();
builder.Services.AddHttpClient<IArticleAIClient, ArticleAIClient>();
builder.Services.AddHttpClient<ICategoryClient, CategoryClient>();
builder.Services.AddHttpClient<ITagClient, TagClient>();
builder.Services.AddHttpClient<IImageClient, ImageClient>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DevBlogCors");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
