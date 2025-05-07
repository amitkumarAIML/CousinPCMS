using CousinPCMS.Domain;
using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

string corsDomains = "http://localhost:4200,http://localhost:5173";
string[] domains = corsDomains.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);


builder.Services.AddCors(o => o.AddPolicy("AppCORSPolicy", builder =>
{
    builder
   .AllowAnyHeader()
   .WithOrigins(domains)
    .AllowAnyMethod()
    .AllowCredentials()
    .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
}));


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddSwaggerGen(options =>
{
    //options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
   {
     new OpenApiSecurityScheme
     {
       Reference = new OpenApiReference
       {
         Type = ReferenceType.SecurityScheme,
         Id = "Bearer"
       },

      },
      new string[] { }
    }});
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Akkomplish CousinPCMS",

    });
});

HardcodedValues.PrefixBCUrl = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:BCUrl1").Value);
HardcodedValues.SuffixBCUrl = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:BCUrl2").Value);
HardcodedValues.TenantId = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:TenantId").Value);
HardcodedValues.PrefixBCODataV4Url = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:ODataV4Url").Value);
HardcodedValues.SuffixBCODataV4Url = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:ODataV4Url2").Value);
HardcodedValues.CompanyName = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:CompanyName").Value);
HardcodedValues.CompanyVAT = Convert.ToString(builder.Configuration.GetSection("BusinessCentral:CompanyVAT").Value);
HardcodedValues.TenantId = Convert.ToString(builder.Configuration.GetSection("ClientCredentials:TenantId").Value);
HardcodedValues.ClientId = Convert.ToString(builder.Configuration.GetSection("ClientCredentials:ClientId").Value);
HardcodedValues.ClientSecret = Convert.ToString(builder.Configuration.GetSection("ClientCredentials:ClientSecret").Value);


var app = builder.Build();
app.UseCors("AppCORSPolicy");

// Configure the HTTP request pipeline.
var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));


// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.DocExpansion(DocExpansion.None);

        c.DefaultModelRendering(ModelRendering.Model);

        c.DefaultModelExpandDepth(3);
        c.DisplayRequestDuration();
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
