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
        /// Gets additional product details.
        /// </summary>       
        /// <returns>returns product object if details are available. Else empty object.</returns>
        [HttpGet("GetAdditionalCategory")]
        [ProducesResponseType(typeof(APIResult<List<AdditionalCategoryModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAdditionalCategory()
        {
            log.Info($"Request of {nameof(GetAdditionalCategory)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _categoryService.GetAdditionalCategory();
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
    }
}
