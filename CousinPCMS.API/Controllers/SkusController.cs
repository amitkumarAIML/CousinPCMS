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
    public class SkusController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly SkusService _skusService;

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
        public SkusController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _skusService = new SkusService(Oauth);
        }

        /// <summary>
        /// Gets related skus.
        /// </summary>       
        /// <returns>returns skus object if details are available. Else empty object.</returns>
        [HttpGet("GetRelatedSkus")]
        [ProducesResponseType(typeof(APIResult<List<RelatedSkusModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetRelatedSkus()
        {
            log.Info($"Request of {nameof(GetRelatedSkus)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetRelatedSkus();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetRelatedSkus)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetRelatedSkus)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets Skus Relation type details.
        /// </summary>      
        /// <returns>returns Items object if details are available. Else empty object.</returns>
        [HttpGet("GetSkusRelationType")]
        [ProducesResponseType(typeof(APIResult<List<SkusRelationTypeModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkusRelationType()
        {
            log.Info($"Request of {nameof(GetSkusRelationType)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetSkusRelationType();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetSkusRelationType)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetSkusRelationType)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Skus layouts.
        /// </summary>       
        /// <returns>returns skus layout object if details are available. Else empty object.</returns>
        [HttpGet("GetSkusLayouts")]
        [ProducesResponseType(typeof(APIResult<List<SkusLayoutModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkusLayouts()
        {
            log.Info($"Request of {nameof(GetSkusLayouts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetSkusLayouts();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetSkusLayouts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetSkusLayouts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing department.
        /// </summary>
        /// <param name="itemId">Item Id is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteItem")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteItem(int itemId)
        {
            log.Info($"Request of {nameof(DeleteItem)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteSkusRequestModel obj = new DeleteSkusRequestModel();
            obj.skuITEMNO = itemId;

            var responseValue = _skusService.DeleteItem(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteItem)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteItem)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }
    }
}
