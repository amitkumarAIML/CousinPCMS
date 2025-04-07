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
    public class ItemController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly ItemService _itemService;

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
        public ItemController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _itemService = new ItemService(Oauth);
        }

        /// <summary>
        /// Gets all items.
        /// </summary>       
        /// <returns>returns Items object if details are available. Else empty object.</returns>
        [HttpGet("GetAllItems")]
        [ProducesResponseType(typeof(APIResult<List<ItemResponseModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllItems()
        {
            log.Info($"Request of {nameof(GetAllItems)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetAllItems();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllItems)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllItems)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets all items by Product Id.
        /// </summary>       
        /// <param name="akiProductID">Pass Product Id</param>
        /// <returns>returns Items object if details are available. Else empty object.</returns>
        [HttpGet("GetAllItemsByProductId")]
        [ProducesResponseType(typeof(APIResult<List<ItemResponseModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllItemsByProductId(string akiProductID)
        {
            log.Info($"Request of {nameof(GetAllItemsByProductId)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetAllItemsByProductId(akiProductID);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllItemsByProductId)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllItemsByProductId)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all items competitors.
        /// </summary>       
        /// <returns>returns Item competitor object if details are available. Else empty object.</returns>
        [HttpGet("GetItemCompetitorDetails")]
        [ProducesResponseType(typeof(APIResult<List<ItemCompetitorModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetItemCompetitorDetails()
        {
            log.Info($"Request of {nameof(GetItemCompetitorDetails)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetItemCompetitorDetails();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetItemCompetitorDetails)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetItemCompetitorDetails)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all items price group details.
        /// </summary>       
        /// <returns>returns dropdown list object if details are available. Else empty object.</returns>
        [HttpGet("GetItemPriceGroupDetails")]
        [ProducesResponseType(typeof(APIResult<List<DropdownListModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetItemPriceGroupDetails()
        {
            log.Info($"Request of {nameof(GetItemPriceGroupDetails)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetItemPriceGroupDetails();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetItemPriceGroupDetails)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetItemPriceGroupDetails)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all items price group details.
        /// </summary>       
        /// <returns>returns dropdown list object if details are available. Else empty object.</returns>
        [HttpGet("GetItemPriceBreaksDetails")]
        [ProducesResponseType(typeof(APIResult<List<DropdownListModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetItemPriceBreaksDetails()
        {
            log.Info($"Request of {nameof(GetItemPriceBreaksDetails)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetItemPriceBreaksDetails();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetItemPriceBreaksDetails)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetItemPriceBreaksDetails)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all items price group details.
        /// </summary>       
        /// <returns>returns dropdown list object if details are available. Else empty object.</returns>
        [HttpGet("GetItemPricingFormulasDetails")]
        [ProducesResponseType(typeof(APIResult<List<DropdownListModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetItemPricingFormulasDetails()
        {
            log.Info($"Request of {nameof(GetItemPricingFormulasDetails)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _itemService.GetItemPricingFormulasDetails();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetItemPricingFormulasDetails)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetItemPricingFormulasDetails)} is failed.");
            }
            return Ok(responseValue);
        }

    }
}
