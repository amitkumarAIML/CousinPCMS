using CousinPCMS.BLL;
using CousinPCMS.Domain;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        /// Logs in the user.
        /// </summary>
        /// <param name="loginModel">Please provide details to login.</param>
        /// <returns>response object, if the login is successful. Else empty object.</returns>
        [HttpPost("Login")]
        [ProducesResponseType(typeof(APIResult<LoginResponseModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            log.Info($"Request of {nameof(Login)} method called with value {JsonConvert.SerializeObject(loginModel)}.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (loginModel.Email != null && loginModel.Password != null)
            {
                var responseValue = _accountService.Login(loginModel);
                if (!responseValue.IsError)
                {
                    log.Info($"Response of {nameof(Login)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(Login)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(Login)} is failed.");
                return BadRequest();
            }
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
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (!string.IsNullOrWhiteSpace(loginModel.token))
            {

                var responseValue = _accountService.EmpLogin(loginModel);
                if (!responseValue.IsError)
                {
                    log.Info($"Response of {nameof(Login)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(Login)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(EmpLogin)} is failed.");
                return BadRequest();
            }
        }


        /// <summary>
        /// Password change for the user.
        /// </summary>
        /// <param name="changePasswordModel">Please provide details to change password.</param>
        /// <returns>Change password object, if the change password is successful. Else empty object.</returns>
        [HttpPost("ChangePassword")]
        [ProducesResponseType(typeof(APIResult<LoginResponseModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel changePasswordModel)
        {
            log.Info($"Request of {nameof(ChangePassword)} method called with value {JsonConvert.SerializeObject(changePasswordModel)}.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (changePasswordModel.Password != null && changePasswordModel.No != null && changePasswordModel.Email != null)
            {
                var responseValue = _accountService.ChangePassword(changePasswordModel);
                if (!responseValue.IsError)
                {
                    log.Info($"Response of {nameof(ChangePassword)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(ChangePassword)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(ChangePassword)} is failed.");
                return BadRequest();
            }
        }

        /// <summary>
        /// Password change for the user.
        /// </summary>
        /// <param name="Email">Please provide email to reset password.</param>
        /// <returns>updated password, if the password reset is successful. Else empty value.</returns>
        [HttpPost("ForgotPassword")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> ForgotPassword(string Email)
        {
            log.Info($"Request of {nameof(ForgotPassword)} method called with value {Email}.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (Email != "")
            {
                var responseValue = _accountService.ResetPassword(Email);

                if (!responseValue.IsSuccess)
                {
                    log.Info($"Response of {nameof(ForgotPassword)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(ForgotPassword)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(ForgotPassword)} is failed.");
                return BadRequest();
            }
        }

        /// <summary>
        /// Send email to user.
        /// </summary>
        /// <param name="objEmail">Please provide email details.</param>
        /// <returns>mail send to user.</returns>
        [HttpPost("SendEmail")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> SendEmail(EmailModel objEmail)
        {
            log.Info($"Request of {nameof(SendEmail)} method called with value {JsonConvert.SerializeObject(objEmail)}.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (objEmail.toEmail != "" && objEmail.subject != "" && objEmail.body != "")
            {
                var responseValue = _accountService.SendEmail(objEmail);
                if (!responseValue.IsError)
                {
                    log.Info($"Response of {nameof(SendEmail)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(SendEmail)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(SendEmail)} is failed.");
                return BadRequest();
            }
        }

        /// <summary>
        /// Password change for the user.
        /// </summary>
        /// <param name="Email">Please provide email to reset password.</param>
        /// <returns>updated password, if the password reset is successful. Else empty value.</returns>
        [HttpPost("LockUser")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> LockUser(string Email)
        {
            log.Info($"Request of {nameof(LockUser)} method called with value {Email}.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            if (Email != "")
            {
                var responseValue = _accountService.LockUser(Email);
                if (!responseValue.IsError)
                {
                    log.Info($"Response of {nameof(LockUser)} is success.");
                }
                else
                {
                    log.Error($"Response of {nameof(LockUser)} is failed.");
                }
                return Ok(responseValue);
            }
            else
            {
                log.Error($"Response of {nameof(LockUser)} is failed.");
                return BadRequest();
            }
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
    }
}
