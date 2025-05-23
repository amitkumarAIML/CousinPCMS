﻿using CousinPCMS.BLL;
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
    public class AttributesController : ControllerBase
    {
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Field to access account service of BAL.
        /// </summary>
        private readonly AttributeService _attributeService;

        public OauthToken Oauth;

        /// <summary>
        ///
        /// </summary>
        private static readonly ILog log = LogManager.GetLogger(
            MethodBase.GetCurrentMethod().DeclaringType
        );

        /// <summary>
        /// Attributes Controller Constructor.
        /// </summary>
        public AttributesController(IConfiguration configuration)
        {
            Oauth = new OauthToken { Token = "", TokenExpiry = DateTime.MinValue };
            Oauth = Helper.GetOauthToken(Oauth);
            _attributeService = new AttributeService(Oauth);
        }

        /// <summary>
        /// Gets all Attributes.
        /// </summary>       
        /// <returns>returns attribute object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributes")]
        [ProducesResponseType(typeof(APIResult<List<AttributesModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributes()
        {
            log.Info($"Request of {nameof(GetAllAttributes)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributes();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributes)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Attributes.
        /// </summary>  
        /// <param name="attributeName">pass selected attributename</param>
        /// <returns>returns attribute object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributesByAttributeName")]
        [ProducesResponseType(typeof(APIResult<List<AttributesModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributesByAttributeName(string attributeName)
        {
            log.Info($"Request of {nameof(GetAllAttributesByAttributeName)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributesByAttributeName(attributeName);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributesByAttributeName)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributesByAttributeName)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Attribute values.
        /// </summary>       
        /// <returns>returns attributevalue object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributeValues")]
        [ProducesResponseType(typeof(APIResult<List<AttributeValuesModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributeValues()
        {
            log.Info($"Request of {nameof(GetAllAttributeValues)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributeValues();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributeValues)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributeValues)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Attribute values.
        /// </summary>       
        /// <param name="attributeName">pass attribute name</param>
        /// <returns>returns attributevalue object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributeValuesByAttribute")]
        [ProducesResponseType(typeof(APIResult<List<AttributeValuesModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributeValuesByAttribute(string attributeName)
        {
            log.Info($"Request of {nameof(GetAllAttributeValuesByAttribute)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributeValuesByAttribute(attributeName);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributeValuesByAttribute)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributeValuesByAttribute)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Attribute sets details.
        /// </summary>       
        /// <returns>returns attribute set object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributeSets")]
        [ProducesResponseType(typeof(APIResult<List<AttributeSetModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributeSets()
        {
            log.Info($"Request of {nameof(GetAllAttributeSets)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributeSets();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributeSets)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributeSets)} is failed.");
            }
            return Ok(responseValue);
        }


        /// <summary>
        /// Gets all Attribute sets details by categoryId.
        /// </summary>       
        /// <param name="CategoryId">pass selected category Id</param>
        /// <returns>returns attribute set object if details are available. Else empty object.</returns>
        [HttpGet("GetDistinctAttributeSetsByCategoryId")]
        [ProducesResponseType(typeof(APIResult<List<AttributeSetModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDistinctAttributeSetsByCategoryId(string CategoryId)
        {
            log.Info($"Request of {nameof(GetDistinctAttributeSetsByCategoryId)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetDistinctAttributeSetsByCategoryId(CategoryId);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetDistinctAttributeSetsByCategoryId)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetDistinctAttributeSetsByCategoryId)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets Attribute set of sets details by atrributesetname.
        /// </summary>       
        /// <param name="attributeSetName">pass selected attribute set name Id</param>
        /// <returns>returns attribute set object if details are available. Else empty object.</returns>
        [HttpGet("GetAttributeSetsByAttributeSetName")]
        [ProducesResponseType(typeof(APIResult<List<AttributeSetModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAttributeSetsByAttributeSetName(string attributeSetName)
        {
            log.Info($"Request of {nameof(GetAttributeSetsByAttributeSetName)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAttributeSetsByAttributeSetName(attributeSetName);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAttributeSetsByAttributeSetName)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAttributeSetsByAttributeSetName)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets all Attribute sets details.
        /// </summary>       
        /// <param name="attributeName">pass attribute name</param>
        /// <returns>returns attribute set object if details are available. Else empty object.</returns>
        [HttpGet("GetAllAttributeSetsByAttribute")]
        [ProducesResponseType(typeof(APIResult<List<AttributeSetModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAllAttributeSetsByAttribute(string attributeName)
        {
            log.Info($"Request of {nameof(GetAllAttributeSets)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAllAttributeSetsByAttribute(attributeName);
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAllAttributeSets)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAllAttributeSets)} is failed.");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// add an attribute detail.
        /// </summary>
        /// <param name="objModel">The object with add details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddAttributes")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddAttributes(AddAttributeRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAttributes)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.AddAttributes(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddAttributes)} failed. Exception: {responseValue.ExceptionInformation}");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// update an attribute detail.
        /// </summary>
        /// <param name="objModel">The object with updated details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("UpdateAttributes")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAttributes(AddAttributeRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateAttributes)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.UpdateAttributes(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateAttributes)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add an attribute value detail.
        /// </summary>
        /// <param name="objModel"> <see cref="AddAttributeValueRequestModel"/>The object with add details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddAttributesValues")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddAttributeValues(AddAttributeValueRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAttributes)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.AddAttributeValues(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddAttributes)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// update attribute value detail.
        /// </summary>
        /// <param name="objModel"> <see cref="AddAttributeValueRequestModel"/>The object with add details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("UpdateAttributeValue")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAttributeValue(UpdateAttributeValueRequestModel objModel)
        {
            log.Info($"Request of {nameof(UpdateAttributeValue)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.UpdateAttributeValue(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateAttributeValue)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateAttributeValue)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// add an attribute set detail.
        /// </summary>
        /// <param name="objModel"> <see cref="AddAttributeSetRequestModel"/>The object with add details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("AddAttributeSets")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> AddAttributeSets(AddAttributeSetRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAttributes)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.AddAttributeSets(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(AddAttributes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(AddAttributes)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// update an attribute set detail.
        /// </summary>
        /// <param name="objModel"> <see cref="UpdateAttributeSetRequestModel"/>The object with updated details.</param>
        /// <returns>Returns success or not.</returns>
        [HttpPost("UpdateAttributeSets")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> UpdateAttributeSets(UpdateAttributeSetRequestModel objModel)
        {
            log.Info($"Request of {nameof(AddAttributes)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.UpdateAttributeSets(objModel);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(UpdateAttributeSets)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(UpdateAttributeSets)} failed. Exception: {responseValue.ExceptionInformation}");
            }

            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing attribute.
        /// </summary>
        /// <param name="attributeName">attribute Name is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteAttribute")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteAttribute(string attributeName)
        {
            log.Info($"Request of {nameof(DeleteAttribute)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteAttributeRequestModel obj = new DeleteAttributeRequestModel();
            obj.attributeName = attributeName;

            var responseValue = _attributeService.DeleteAttribute(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteAttribute)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteAttribute)} failed. Exception: {responseValue.ExceptionInformation}");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing attribute value.
        /// </summary>
        /// <param name="attributeName">attribute Name is passed.</param>
        /// <param name="attributeValue">attribute value is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteAttributeValue")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteAttributeValue(string attributeName, string attributeValue)
        {
            log.Info($"Request of {nameof(DeleteAttributeValue)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteAttributeValueRequestModel obj = new DeleteAttributeValueRequestModel();
            obj.attributeName = attributeName;
            obj.attributeValue = attributeValue;

            var responseValue = _attributeService.DeleteAttributeValue(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteAttributeValue)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteAttributeValue)} failed. Exception: {responseValue.ExceptionInformation}");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Deletes the existing attribute.
        /// </summary>
        /// <param name="attributeName">attribute Name is passed.</param>
        /// <param name="attributeSetName">attribute Set Name is passed.</param>
        /// <returns>Returns success or error message.</returns>
        [HttpGet("DeleteAttributeSets")]
        [ProducesResponseType(typeof(APIResult<string>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> DeleteAttributeSets(string attributeName, string attributeSetName)
        {
            log.Info($"Request of {nameof(DeleteAttributeSets)} method called.");

            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }
            DeleteAttributeSetRequestModel obj = new DeleteAttributeSetRequestModel();
            obj.attributeName = attributeName;
            obj.attributeSetName = attributeSetName;

            var responseValue = _attributeService.DeleteAttributeSets(obj);

            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(DeleteAttributeSets)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(DeleteAttributeSets)} failed. Exception: {responseValue.ExceptionInformation}");
            }
            return Ok(responseValue);
        }

        /// <summary>
        /// Gets attribute search type dropdown details.
        /// </summary>       
        /// <returns>returns dropdown list object if details are available. Else empty object.</returns>
        [HttpGet("GetAttributeSearchTypes")]
        [ProducesResponseType(typeof(APIResult<List<DropdownListModel>>), 200)]
        [ProducesResponseType(500)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetAttributeSearchTypes()
        {
            log.Info($"Request of {nameof(GetAttributeSearchTypes)} method called.");
            if (Oauth.TokenExpiry <= DateTime.Now)
            {
                Oauth = Helper.GetOauthToken(Oauth);
            }

            var responseValue = _attributeService.GetAttributeSearchTypes();
            if (!responseValue.IsError)
            {
                log.Info($"Response of {nameof(GetAttributeSearchTypes)} is success.");
            }
            else
            {
                log.Error($"Response of {nameof(GetAttributeSearchTypes)} is failed.");
            }
            return Ok(responseValue);
        }
    }
}
