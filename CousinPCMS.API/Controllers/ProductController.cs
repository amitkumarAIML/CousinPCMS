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
    }
}
