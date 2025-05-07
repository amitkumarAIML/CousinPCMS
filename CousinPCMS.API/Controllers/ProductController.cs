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
        /// Field to access account service of BLL.
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
        /// Initializes a new instance of the <see cref="ProductController"/> class with the specified configuration settings.
        /// </summary>
        /// <param name="configuration">The application configuration instance used for accessing configuration values.</param>
        public ProductController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _productService = new ProductService(Oauth);
        }

        /// <summary>
        /// Retrieves a list of product details for the specified category.
        /// </summary>
        /// <param name="CategoryID">The unique identifier of the category to filter products by.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{List{ProductModel}}"/> containing a list of products for the given category if available; otherwise, returns an empty list.
        /// </returns>
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
        /// Retrieves a paginated list of product details.
        /// </summary>
        /// <param name="pageSize">The number of products to retrieve per page.</param>
        /// <param name="pageNumber">The page number to retrieve.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{ProductResponseModel}"/> containing a list of products if available; otherwise, returns an empty list.
        /// </returns>
        [HttpGet("GetAllProducts")]
        [ProducesResponseType(typeof(APIResult<ProductResponseModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllProducts(int pageSize, int pageNumber, string productName = "")
        {
            log.Info($"Request of {nameof(GetAllProducts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            APIResult<ProductResponseModel> responseValue;

            if (productName != "")
            {
                responseValue = _productService.SearchProducts(pageSize, pageNumber, productName);
            }
            else
            {
                responseValue = _productService.GetAllProducts(pageSize, pageNumber);
            }

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
        /// Searches and retrieves a paginated list of product details based on the provided product name.
        /// </summary>
        /// <param name="pageSize">The number of products to return per page.</param>
        /// <param name="pageNumber">The page number to retrieve.</param>
        /// <param name="productName">The name (or part of the name) of the product to search for.</param>
        /// <returns>
        /// An <see cref="APIResult{ProductResponseModel}"/> containing the total record count and a list of matching products, 
        /// or an empty list if no matches are found.
        /// </returns>
        [HttpGet("SearchProducts")]
        [ProducesResponseType(typeof(APIResult<ProductResponseModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> SearchProducts(int pageSize, int pageNumber, string productName)
        {
            log.Info($"Request of {nameof(SearchProducts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.SearchProducts(pageSize, pageNumber, productName);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(SearchProducts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(SearchProducts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Retrieves product details for the specified product ID.
        /// </summary>
        /// <param name="akiProductID">The unique identifier of the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{List{ProductModel}}"/> containing the product details if found; otherwise, returns an empty list.
        /// </returns>
        [HttpGet("GetProductById")]
        [ProducesResponseType(typeof(APIResult<List<ProductModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetProductById(int akiProductID)
        {
            log.Info($"Request of {nameof(GetProductById)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetProductById(akiProductID.ToString());
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetProductById)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetProductById)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Retrieves all available product layout details.
        /// </summary>
        /// <returns>
        /// Returns an <see cref="APIResult{List{ProductLayoutModel}}"/> containing a list of product layouts if available; otherwise, returns an empty list.
        /// </returns>
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
        /// Deletes the product associated with the specified product ID.
        /// </summary>
        /// <param name="productId">The unique identifier of the product to be deleted.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
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
        /// Updates the details of an existing product.
        /// </summary>
        /// <param name="objModel">An <see cref="UpdateProductModel"/> containing the updated product information.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{ProductModel}"/> with the updated product details if successful; otherwise, returns null or an error message.
        /// </returns>
        [HttpPost("UpdateProduct")]
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
        /// Adds a new product.
        /// </summary>
        /// <param name="objModel">An <see cref="AddProductRequestModel"/> containing the updated product information.</param>
        /// <returns>
        /// Returns an successs or an error message.
        /// </returns>
        [HttpPost("AddProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddProduct(AddProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.AddProduct(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Retrieves the linked URLs for the specified product.
        /// </summary>
        /// <param name="productId">The unique identifier of the product for which linked URLs are to be fetched.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{List{ProductLinkedUrlModel}}"/> containing the linked URLs for the product if available; otherwise, returns an empty list.
        /// </returns>
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
        /// Retrieves the additional image details for the specified product.
        /// </summary>
        /// <param name="ProductId">The unique identifier of the product for which additional images are to be fetched.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{List{ProductAdditionalImageModel}}"/> containing the additional images for the product if available; otherwise, returns an empty list.
        /// </returns>
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
        /// Deletes the linked URL for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details required to delete the linked URL for the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
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
        /// Deletes the additional images for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details required to delete the additional images for the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
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
        /// Adds additional images for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details of the images to be added to the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
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
        /// Updates list order of additional images for a specified product.
        /// </summary>
        /// <param name="imageList">List of image details to update.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
        [HttpPost("UpdateProductAdditionalImages")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateProductAdditionalImages(UpdateProductAdditionalImageRequestModel imageList)
        {
            log.Info($"Request of {nameof(UpdateProductAdditionalImages)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.UpdateProductAdditionalImages(imageList);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateProductAdditionalImages)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateProductAdditionalImages)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Adds linked URLs for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details of the URLs to be added to the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
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

        /// <summary>
        /// Update linked URLs for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details of the URLs to be added to the product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
        [HttpPost("UpdateProductLinkUrls")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateProductLinkUrls(UpdateProductUrlsRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateProductLinkUrls)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.UpdateProductLinkUrls(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateProductLinkUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateProductLinkUrls)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Retrieves the associated product details for the specified product ID.
        /// </summary>
        /// <param name="productId">The unique identifier of the product for which associated details are to be fetched.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{List{AdditionalCategoryModel}}"/> containing the associated product details if available; otherwise, returns an empty list.
        /// </returns>
        [HttpGet("GetAdditionalProduct")]
        [ProducesResponseType(typeof(APIResult<List<AdditionalCategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAdditionalProduct(string productId)
        {
            log.Info($"Request of {nameof(GetAdditionalProduct)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.GetAdditionalProduct(productId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAdditionalProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAdditionalProduct)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Updates the associated product details for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the updated details of the associated product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{CategoryModel}"/> with the updated associated product details, or null if no update occurs.
        /// </returns>
        [HttpPost("UpdateAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<CategoryModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAssociatedProduct(AdditionalProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateAssociatedProduct)} method called.");

            // Refresh token if expired
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            APIResult<string> responseValue;

            responseValue = _productService.UpdateAssociatedProduct(objModel);

            // Logging result
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateAssociatedProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateAssociatedProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Adds an associated product detail for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details to be added for the associated product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
        [HttpPost("AddAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddAssociatedProduct(AdditionalProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAssociatedProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.AddAssociatedProduct(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddAssociatedProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddAssociatedProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the associated product for the specified product.
        /// </summary>
        /// <param name="objModel">An object containing the details required to delete the associated product.</param>
        /// <returns>
        /// Returns an <see cref="APIResult{string}"/> indicating success or failure with a corresponding message.
        /// </returns>
        [HttpPost("DeleteAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteAssociatedProduct(DeleteAssociatedProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteAssociatedProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _productService.DeleteAssociatedProduct(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteAssociatedProduct)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteAssociatedProduct)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }
    }
}
