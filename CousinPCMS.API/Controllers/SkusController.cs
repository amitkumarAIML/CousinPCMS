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
        /// Retrieves linked attribute details for the specified SKU item.
        /// </summary>
        /// <param name="akiItemNo">The SKU item number.</param>
        /// <returns>Returns a list of linked attribute details if available; otherwise, an empty list.</returns>
        [HttpGet("GetSkuLinkedAttributes")]
        [ProducesResponseType(typeof(APIResult<List<SkusRelationTypeModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkuLinkedAttributes(string akiItemNo)
        {
            log.Info($"Request to {nameof(GetSkuLinkedAttributes)} received for ItemNo: {akiItemNo}");

            // Refresh token if expired
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            // Call service
            var responseValue = _skusService.GetSkuLinkedAttributes(akiItemNo);

            // Log based on result
            if (responseValue.IsError)
            {
                log.Error($"Failed to retrieve data in {nameof(GetSkuLinkedAttributes)} for ItemNo: {akiItemNo}");
            }
            else
            {
                log.Info($"Successfully retrieved data in {nameof(GetSkuLinkedAttributes)} for ItemNo: {akiItemNo}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Retrieves SKU attribute details based on the specified category ID.
        /// </summary>
        /// <param name="categoryId">The category ID for which attributes are to be fetched.</param>
        /// <returns>Returns a list of SKU attributes if available; otherwise, an empty list.</returns>
        [HttpGet("GetSkuAttributesBycategoryId")]
        [ProducesResponseType(typeof(APIResult<List<SkusRelationTypeModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkuAttributesBycategoryId(string categoryId)
        {
            log.Info($"Request to {nameof(GetSkuAttributesBycategoryId)} received for CategoryId: {categoryId}");

            // Refresh token if expired
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            // Call service
            var responseValue = _skusService.GetSkuAttributesBycategoryId(categoryId);

            // Log based on result
            if (responseValue.IsError)
            {
                log.Error($"Failed to retrieve data in {nameof(GetSkuAttributesBycategoryId)} for CategoryId: {categoryId}");
            }
            else
            {
                log.Info($"Successfully retrieved data in {nameof(GetSkuAttributesBycategoryId)} for CategoryId: {categoryId}");
            }

            return Ok(responseValue);
        }

        [HttpPost("GetAttributeValuesByListofNames")]
        [ProducesResponseType(typeof(APIResult<List<AttributesModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAttributeValuesByListofNames([FromBody] AttributeFilterRequest request)
        {
            log.Info($"Request to {nameof(GetAttributeValuesByListofNames)} received.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var result = await Task.FromResult(_skusService.GetAttributeValuesByListofNames(request.attributeNames));

            if (result.IsError)
            {
                log.Error($"Response from {nameof(GetAttributeValuesByListofNames)} failed.");
                return StatusCode(500, result);
            }

            log.Info($"Response from {nameof(GetAttributeValuesByListofNames)} succeeded.");
            return Ok(result);
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

        /// <summary>
        /// Gets linked urls for resp Sku.
        /// <paramref name="skuItemID"/> 
        /// </summary>       
        /// <returns>returns Sku linked url object if details are available. Else empty object.</returns>
        [HttpGet("GetSkuUrls")]
        [ProducesResponseType(typeof(APIResult<List<SkusLinkedURlModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkuUrls(string skuItemID)
        {
            log.Info($"Request of {nameof(GetSkuUrls)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetSkuUrls(skuItemID);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetSkuUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetSkuUrls)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets Sku additional images details.
        /// <paramref name="skuItemID"/> 
        /// </summary>       
        /// <returns>returns sku images object if details are available. Else empty object.</returns>
        [HttpGet("GetSkuAdditionalImages")]
        [ProducesResponseType(typeof(APIResult<List<SkusAdditionalImageModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSkuAdditionalImages(string skuItemID)
        {
            log.Info($"Request of {nameof(GetSkuAdditionalImages)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.GetSkuAdditionalImages(skuItemID);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetSkuAdditionalImages)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetSkuAdditionalImages)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the linked url for that sku
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteSkuLinkUrl")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteSkuLinkUrl(DeleteSkuURLRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteSkuLinkUrl)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.DeleteSkuLinkUrl(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteSkuLinkUrl)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteSkuLinkUrl)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the additional images for that sku
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteSkuAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteSkuAdditionalImage(DeleteSkuImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteSkuAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.DeleteSkuAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteSkuAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteSkuAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add additional images for the Sku
        /// </summary>
        /// <param name="objModel">The object with add image details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddSkuAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddSkuAdditionalImage(AddSkuAdditionalImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddSkuAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.AddSkuAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddSkuAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddSkuAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add linked urls for the Sku
        /// </summary>
        /// <param name="objModel">The object with add url details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddSkuLinkUrls")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddSkuLinkUrls(AddSkuAdditionalLinkUrlRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddSkuLinkUrls)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.AddSkuLinkUrls(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddSkuLinkUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddSkuLinkUrls)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Adds or updates SKU linked attribute details.
        /// </summary>
        /// <param name="objModel">The request model containing SKU and attribute information to be added or updated.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{T}"/> with a success or error message depending on the outcome.
        /// </returns>
        [HttpPost("AddUpdateSKULinkedAttribute")]
        [ProducesResponseType(typeof(APIResult<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> AddUpdateSKULinkedAttribute([FromBody] AddUpdateSKULinkedAttributeRequestModel objModel)
        {
            log.Info($"Request received for {nameof(AddUpdateSKULinkedAttribute)} method.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _skusService.AddUpdateSKULinkedAttribute(objModel);

            if (responseValue.IsError)
            {
                log.Error($"Response from {nameof(AddUpdateSKULinkedAttribute)} failed. Exception: {responseValue.ExceptionInformation}");
            }
            else
            {
                log.Info($"Response from {nameof(AddUpdateSKULinkedAttribute)} succeeded.");
            }

            return Ok(responseValue);
        }
    }
}
