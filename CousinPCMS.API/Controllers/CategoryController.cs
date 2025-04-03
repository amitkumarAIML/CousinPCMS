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
        /// <returns>Returns object of category update detail or null.</returns>
        [HttpPatch("UpdateCategory")]
        [ProducesResponseType(typeof(APIResult<CategoryModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateCategory(AddCategoryRequestModel objModel)
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
        /// Updates an associate product detail for category.
        /// </summary>
        /// <param name="objModel">The object with updated details.</param>
        /// <returns>Returns object of associated product update detail or null.</returns>
        [HttpPatch("UpdateAssociatedProduct")]
        [ProducesResponseType(typeof(APIResult<CategoryModel>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAssociatedProduct(AssociatedProductRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateAssociatedProduct)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.UpdateAssociatedProduct(objModel);

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

            var responseValue = _categoryService.AddAssociatedProduct(objModel);

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
    }
}
