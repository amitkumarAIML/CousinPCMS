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
        /// <paramref name="itemNumber"> Pass item number </paramref>
        /// </summary>       
        /// <returns>returns skus object if details are available. Else empty object.</returns>
        [HttpGet("GetRelatedSkusByItemNumber")]
        [ProducesResponseType(typeof(APIResult<List<RelatedSkusModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetRelatedSkusByItemNumber(string itemNumber)
        {
            log.Info($"Request of {nameof(GetRelatedSkusByItemNumber)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetRelatedSkus(itemNumber);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetRelatedSkusByItemNumber)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetRelatedSkusByItemNumber)} is failed.");
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
        /// <param name="itemno">Item number is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteItem")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteItem(string itemno)
        {
            log.Info($"Request of {nameof(DeleteItem)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteSkusRequestModel obj = new DeleteSkusRequestModel();
            obj.itemno = itemno;

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

        /// <summary>
        /// updates related item of respective sku.
        /// </summary>
        /// <param name="objModel">pass the object with required details to update.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPost("UpdateItemRelatedSku")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateItemRelatedSku(UpdateItemRelatedSkuModel objModel)
        {
            log.Info($"Request of {nameof(UpdateItemRelatedSku)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.UpdateItemRelatedSku(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateItemRelatedSku)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateItemRelatedSku)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// updates sku item.
        /// </summary>
        /// <param name="objModel">pass the object with required details to update.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPost("UpdateItemSKU")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateItemSKU(UpdateSkuItemRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateItemSKU)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.UpdateItemSKU(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateItemSKU)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateItemSKU)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all items by item number.
        /// </summary>       
        /// <param name="itemNumber">Pass item number</param>
        /// <returns>returns Items object if details are available. Else empty object.</returns>
        [HttpGet("GetAllItemsByitemNumber")]
        [ProducesResponseType(typeof(APIResult<List<ItemResponseModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllItemsByitemNumber(string itemNumber)
        {
            log.Info($"Request of {nameof(GetAllItemsByitemNumber)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetAllItemsByitemNumber(itemNumber);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllItemsByitemNumber)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllItemsByitemNumber)} is failed.");
            }
            return Ok(responseValue);
        }
    }
}
