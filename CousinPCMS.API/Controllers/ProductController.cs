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
    public class ProductController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly ProductService _productService;

        public OauthToken Oauth;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );

        /// <summary>
        /// ProductController Constructor.
        /// </summary>
        public ProductController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _productService = new ProductService(Oauth);
        }

        /// <summary>
        /// Gets product details for respective category.
        /// </summary>       
        /// <returns>returns product object if details are available. Else empty object.</returns>
        [HttpGet("GetProductsByCategory")]
        [ProducesResponseType(typeof(APIResult<List<ProductModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetProductsByCategory(string CategoryID)
        {
            log.Info($"Request of {nameof(GetProductsByCategory)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetProductsByCategory(CategoryID);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetProductsByCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetProductsByCategory)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all product details.
        /// </summary>       
        /// <returns>returns product object if details are available. Else empty object.</returns>
        [HttpGet("GetAllProducts")]
        [ProducesResponseType(typeof(APIResult<List<ProductModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllProducts()
        {
            log.Info($"Request of {nameof(GetAllProducts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetAllProducts();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllProducts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllProducts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Product layouts.
        /// </summary>       
        /// <returns>returns product layout object if details are available. Else empty object.</returns>
        [HttpGet("GetProductLayouts")]
        [ProducesResponseType(typeof(APIResult<List<ProductLayoutModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetProductLayouts()
        {
            log.Info($"Request of {nameof(GetProductLayouts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetProductLayouts();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetProductLayouts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetProductLayouts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing Product.
        /// </summary>
        /// <param name="productId">product Id is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            log.Info($"Request of {nameof(DeleteProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteProductRequestModel obj = new DeleteProductRequestModel();
            obj.productID = productId;

            var responseValue = _productService.DeleteProduct(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        /// <param name="objModel">The product object with updated details.</param>
        /// <returns>Returns object of product update detail or null.</returns>
        [HttpPatch("UpdateProduct")]
        [ProducesResponseType(typeof(APIResult<ProductModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateProduct(UpdateProductModel objModel)
        {
            log.Info($"Request of {nameof(UpdateProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.UpdateProduct(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Gets linked urls for resp Product.
        /// <paramref name="productId"/> 
        /// </summary>       
        /// <returns>returns Product linked url object if details are available. Else empty object.</returns>
        [HttpGet("GetProductUrls")]
        [ProducesResponseType(typeof(APIResult<List<ProductLinkedURlModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetProductUrls(string productId)
        {
            log.Info($"Request of {nameof(GetProductUrls)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetProductUrls(productId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetProductUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetProductUrls)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets Product additional images details.
        /// <paramref name="ProductId"/> 
        /// </summary>       
        /// <returns>returns Product images object if details are available. Else empty object.</returns>
        [HttpGet("GetProductAdditionalImages")]
        [ProducesResponseType(typeof(APIResult<List<ProductAdditionalImageModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetProductAdditionalImages(string ProductId)
        {
            log.Info($"Request of {nameof(GetProductAdditionalImages)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetProductAdditionalImages(ProductId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetProductAdditionalImages)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetProductAdditionalImages)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the linked url for that Product
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteProductLinkUrl")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteProductLinkUrl(DeleteProductURLRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteProductLinkUrl)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.DeleteProductLinkUrl(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteProductLinkUrl)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteProductLinkUrl)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the additional images for that Product
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteProductAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteProductAdditionalImage(DeleteProductImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteProductAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.DeleteProductAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteProductAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteProductAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add additional images for the Product
        /// </summary>
        /// <param name="objModel">The object with add image details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddProductAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddProductAdditionalImage(AddProductAdditionalImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddProductAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.AddProductAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddProductAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddProductAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add linked urls for the Product
        /// </summary>
        /// <param name="objModel">The object with add url details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddProductLinkUrls")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddProductLinkUrls(AddProductAdditionalLinkUrlRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddProductLinkUrls)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.AddProductLinkUrls(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddProductLinkUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddProductLinkUrls)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }
    }
}
