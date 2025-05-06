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
    public class CategoryController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly CategoryService _categoryService;

        public OauthToken Oauth;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );

        /// <summary>
        /// CategoryController Constructor.
        /// </summary>
        public CategoryController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _categoryService = new CategoryService(Oauth);
        }

        /// <summary>
        /// Gets all categories.
        /// </summary>       
        /// <returns>returns category object if details are available. Else empty object.</returns>
        [HttpGet("GetAllCategory")]
        [ProducesResponseType(typeof(APIResult<List<CategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllCategory()
        {
            log.Info($"Request of {nameof(GetAllCategory)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetAllCategory();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllCategory)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all categories by Id.
        /// </summary>       
        /// <param name="categoryId">Pass category id</param>
        /// <returns>returns category object if details are available. Else empty object.</returns>
        [HttpGet("GetCategoryById")]
        [ProducesResponseType(typeof(APIResult<List<CategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCategoryById(string categoryId)
        {
            log.Info($"Request of {nameof(GetCategoryById)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetCategoryById(categoryId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCategoryById)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCategoryById)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all categories by departments.
        /// </summary>       
        /// <param name="deptId"> pass department id for fetching details</param>
        /// <returns>returns category object if details are available. Else empty object.</returns>
        [HttpGet("GetAllCategoryBYDeptId")]
        [ProducesResponseType(typeof(APIResult<List<CategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllCategoryBYDeptId(string deptId)
        {
            log.Info($"Request of {nameof(GetAllCategoryBYDeptId)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetAllCategoryBYDeptId(deptId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllCategoryBYDeptId)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllCategoryBYDeptId)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all categories.
        /// </summary>       
        /// <returns>returns category object if details are available. Else empty object.</returns>
        [HttpGet("GetLinkedAttributes")]
        [ProducesResponseType(typeof(APIResult<List<LinkedAttributeModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetLinkedAttributes()
        {
            log.Info($"Request of {nameof(GetLinkedAttributes)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetLinkedAttributes();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetLinkedAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetLinkedAttributes)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets associated product details by category id.
        /// <paramref name="categoryId"/> 
        /// </summary>       
        /// <returns>returns product object if details are available. Else empty object.</returns>
        [HttpGet("GetAdditionalCategory")]
        [ProducesResponseType(typeof(APIResult<List<AdditionalCategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAdditionalCategory(string categoryId)
        {
            log.Info($"Request of {nameof(GetAdditionalCategory)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetAdditionalCategory(categoryId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAdditionalCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAdditionalCategory)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets all Category layouts.
        /// </summary>       
        /// <returns>returns category layout object if details are available. Else empty object.</returns>
        [HttpGet("GetCategoryLayouts")]
        [ProducesResponseType(typeof(APIResult<List<CategoryLayoutModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCategoryLayouts()
        {
            log.Info($"Request of {nameof(GetCategoryLayouts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetCategoryLayouts();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCategoryLayouts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCategoryLayouts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing category.
        /// </summary>
        /// <param name="categoryId">category Id is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteCategory")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteCategory(string categoryId)
        {
            log.Info($"Request of {nameof(DeleteCategory)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteCategoryRequestModel obj = new DeleteCategoryRequestModel();
            obj.categoryID = categoryId;

            var responseValue = _categoryService.DeleteCategory(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteCategory)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        /// <param name="objModel">The category object with updated details.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPost("UpdateCategory")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateCategory(UpdateCategoryModel objModel)
        {
            log.Info($"Request of {nameof(UpdateCategory)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.UpdateCategory(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateCategory)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Adds an category.
        /// </summary>
        /// <param name="objModel">The category object with added details.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPost("AddCategory")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddCategory(AddCategoryModel objModel)
        {
            log.Info($"Request of {nameof(AddCategory)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.AddCategory(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddCategory)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddCategory)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Updates an associated product detail for category.
        /// </summary>
        /// <param name="objModel">The object with updated details.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPost("UpdateAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAssociatedProduct(AssociatedProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateAssociatedProduct)} method called.");

            // Refresh token if expired
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            APIResult<string> responseValue;

            var objRequest = new AddAdditionalProductforCategoryRequestModel
            {
                prodCategory = objModel.additionalCategory,
                product = objModel.Product,
                listorder = objModel.Listorder
            };
            if (objModel.isAdditionalProduct)
            {
                responseValue = _categoryService.UpdateAssociatedProduct(objRequest);
            }
            else
            {
                responseValue = _categoryService.UpdateProductListorder(objRequest);
            }

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
        /// add an associate product detail for category.
        /// </summary>
        /// <param name="objModel">The object with add details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddAssociatedProduct(AssociatedProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAssociatedProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var objRequest = new AddAdditionalProductforCategoryRequestModel();
            objRequest.prodCategory = objModel.additionalCategory;
            objRequest.product = objModel.Product;
            objRequest.listorder = objModel.Listorder;

            var responseValue = _categoryService.AddAssociatedProduct(objRequest);

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
        /// Gets linked urls for resp category.
        /// <paramref name="categoryId"/> 
        /// </summary>       
        /// <returns>returns category linked url object if details are available. Else empty object.</returns>
        [HttpGet("GetCategoryUrls")]
        [ProducesResponseType(typeof(APIResult<List<CategoryLinkedURlModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCategoryUrls(string categoryId)
        {
            log.Info($"Request of {nameof(GetCategoryUrls)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetCategoryUrls(categoryId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCategoryUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCategoryUrls)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets category additional images details.
        /// <paramref name="categoryId"/> 
        /// </summary>       
        /// <returns>returns category images object if details are available. Else empty object.</returns>
        [HttpGet("GetCategoryAdditionalImages")]
        [ProducesResponseType(typeof(APIResult<List<CategoryAdditionalImageModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCategoryAdditionalImages(string categoryId)
        {
            log.Info($"Request of {nameof(GetCategoryAdditionalImages)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetCategoryAdditionalImages(categoryId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetCategoryAdditionalImages)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetCategoryAdditionalImages)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the linked url for that category
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteCategoryLinkUrl")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteCategoryLinkUrl(DeleteCategoryURLRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteCategoryLinkUrl)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.DeleteCategoryLinkUrl(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteCategoryLinkUrl)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteCategoryLinkUrl)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the additional images for that category
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteCategoryAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteCategoryAdditionalImage(DeleteCategoryImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteCategoryAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.DeleteCategoryAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteCategoryAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteCategoryAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add additional images for the category
        /// </summary>
        /// <param name="objModel">The object with add image details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddCategoryAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddCategoryAdditionalImage(AddCategoryAdditionalImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddCategoryAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.AddCategoryAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddCategoryAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddCategoryAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// updates additional images for the category
        /// </summary>
        /// <param name="objModel">The object with add image details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("UpdateCategoryAdditionalImage")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateCategoryAdditionalImage(UpdateCategoryAdditionalImageRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateCategoryAdditionalImage)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.UpdateCategoryAdditionalImage(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateCategoryAdditionalImage)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateCategoryAdditionalImage)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add linked urls for the category
        /// </summary>
        /// <param name="objModel">The object with add url details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddCategoryLinkUrls")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddCategoryLinkUrls(AddCategoryAdditionalLinkUrlRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddCategoryLinkUrls)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.AddCategoryLinkUrls(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddCategoryLinkUrls)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddCategoryLinkUrls)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// deletes the associated product
        /// </summary>
        /// <param name="objModel">The object with delete details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("DeleteAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteAssociatedProduct(DeleteAssociatedProductCatRequestModel objModel)
        {
            log.Info($"Request of {nameof(DeleteAssociatedProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.DeleteAssociatedProduct(objModel);

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
