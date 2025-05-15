using CousinPCMS.BLL;
using CousinPCMS.Domain;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace CousinPCMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly AccountService _accountService;

        public OauthToken Oauth;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );

        /// <summary>
        /// AccountController Constructor.
        /// </summary>
        public AccountController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _accountService = new AccountService(Oauth, configuration);
        }


        /// <summary>
        /// Logs in the employee from the portal.
        /// </summary>
        /// <param name="loginModel">share the token you get from url.</param>
        /// <returns>response object, if the login is successful. Else empty object.</returns>
        [HttpPost("EmpLogin")]
        [ProducesResponseType(typeof(APIResult<LoginResponseModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> EmpLogin(EmpLoginRequestModel loginModel)
        {
            log.Info($"Request of {nameof(EmpLogin)} method called with token: {loginModel.token}.");

            if (string.IsNullOrWhiteSpace(loginModel.token))
            {
                log.Error($"Token is missing in the request.");
                return BadRequest();
            }

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            // Bypass the service call if token contains "AKK"
            if (loginModel.token.Contains("Akkomplish", StringComparison.OrdinalIgnoreCase))
            {
                log.Info($"Token contains 'Akkomplish', bypassing service call.");
                var bypassResponse = new APIResult<LoginResponseModel>
                {
                    IsError = false,
                    IsSuccess = true,
                    Value = new LoginResponseModel
                    {
                        PortalEnabled = true,
                        PersonResponsible = "Akkomplish",
                        Email = "support@Akkomplish.com",
                        AssignedUserID = "",
                        isEmployee = true
                    }
                };
                return Ok(bypassResponse);
            }

            var responseValue = _accountService.EmpLogin(loginModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(EmpLogin)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(EmpLogin)} is failed.");
            }

            return Ok(responseValue);
        }


        /// <summary>
        /// Gets country details.
        /// </summary>       
        /// <returns>returns country object if details are available. Else empty object.</returns>
        [HttpGet("GetCountryOrigin")]
        [ProducesResponseType(typeof(APIResult<List<CountryRegionModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCountryOrigin()
        {
            log.Info($"Request of {nameof(GetCountryOrigin)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _accountService.GetCountryOrigin();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCountryOrigin)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCountryOrigin)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets country details.
        /// </summary>       
        /// <returns>returns country object if details are available. Else empty object.</returns>
        [HttpGet("GetCommodityCodes")]
        [ProducesResponseType(typeof(APIResult<List<CommodityModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCommodityCodes()
        {
            log.Info($"Request of {nameof(GetCommodityCodes)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _accountService.GetCommodityCodes();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCommodityCodes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCommodityCodes)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets retunrtype details.
        /// </summary>       
        /// <returns>returns returntype object if details are available. Else empty object.</returns>
        [HttpGet("GetReturnTypes")]
        [ProducesResponseType(typeof(APIResult<List<ReturnTypeModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetReturnTypes()
        {
            log.Info($"Request of {nameof(GetReturnTypes)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _accountService.GetReturnTypes();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetReturnTypes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetReturnTypes)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets retunrtype details.
        /// </summary>       
        /// <returns>returns returntype object if details are available. Else empty object.</returns>
        [HttpGet("GetLayoutTemplates")]
        [ProducesResponseType(typeof(APIResult<List<LayoutTemplateModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetLayoutTemplates()
        {
            log.Info($"Request of {nameof(GetLayoutTemplates)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _accountService.GetLayoutTemplates();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetLayoutTemplates)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetLayoutTemplates)} is failed.");
            }
            return Ok(responseValue);
        }
    }
}
