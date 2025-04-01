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
    public class DepartmentController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly DepartmentService _deptService;

        public OauthToken Oauth;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );

        /// <summary>
        /// DepartmentController Constructor.
        /// </summary>
        public DepartmentController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _deptService = new DepartmentService(Oauth);
        }

        /// <summary>
        /// Gets all departments.
        /// </summary>       
        /// <returns>returns department object if details are available. Else empty object.</returns>
        [HttpGet("GetAllDepartment")]
        [ProducesResponseType(typeof(APIResult<List<DepartmentModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllDepartment()
        {
            log.Info($"Request of {nameof(GetAllDepartment)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _deptService.GetAllDepartment();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllDepartment)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllDepartment)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all department layout.
        /// </summary>       
        /// <returns>returns department layout object if details are available. Else empty object.</returns>
        [HttpGet("GetDepartmentLayouts")]
        [ProducesResponseType(typeof(APIResult<List<DepartmentLayoutModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDepartmentLayouts()
        {
            log.Info($"Request of {nameof(GetDepartmentLayouts)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _deptService.GetDepartmentLayouts();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetDepartmentLayouts)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetDepartmentLayouts)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Updates an existing department.
        /// </summary>
        /// <param name="objModel">The department object with updated details.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpPatch("UpdateDepartment")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateDepartment(AddDepartmentRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateDepartment)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _deptService.UpdateDepartment(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateDepartment)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateDepartment)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

    }
}
