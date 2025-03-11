using log4net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using CousinPCMS.BLL;
using CousinPCMS.Domain;

namespace CousinPCMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly TokenService _tokenService;

        private readonly IConfiguration _configuration;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );
        /// <summary>
        /// AccountController Constructor.
        /// </summary>
        public TokenController(IConfiguration configuration)
        {
            _configuration = configuration;
            _tokenService = new TokenService();
        }

        /// <summary>
        /// Generates Token.
        /// </summary>
        /// <param name="_userData">Please provide details to generate token.</param>
        /// <returns></returns>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/Token
        ///     {
        ///         {
        ///             "id": 0,
        ///             "name": "string",
        ///             "guid": "E2960383-F9A5-49F7-91F8-E3F93897E603"
        ///         }
        ///     }
        ///   </remarks>
        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Post(ClientInformation _userData)

        {
            log.Info($"Request of {nameof(Post)} method called with value {JsonConvert.SerializeObject(_userData)}.");
            if (_userData != null && _userData.Name != null && _userData.Guid != null)
            {
                var user = _tokenService.CheckIfClientExists(_userData.Guid);
                if (user != null && user.IsSuccess)
                {
                    //create claims details based on the user information
                    var claims = new[] {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };
                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(10),
                        signingCredentials: signIn);
                    log.Info($"Response of {nameof(Post)} is success.");
                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
                else
                {
                    log.Error($"Response of {nameof(Post)} is failed.");
                    return BadRequest("You have not yet subscribed.");
                }
            }
            else
            {
                log.Error($"Response of {nameof(Post)} is failed.");
                return BadRequest();
            }
        }

    }
}