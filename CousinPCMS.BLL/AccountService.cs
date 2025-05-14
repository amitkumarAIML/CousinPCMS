using Akkomplish.Framework;
using CousinPCMS.Domain;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;
using System.Web;

namespace CousinPCMS.BLL
{
    public class AccountService
    {
        OauthToken Oauth;
        /// <summary>
        /// Field for access configurations.
        /// </summary>
        private readonly IConfiguration configuration;

        public AccountService(OauthToken oauthToken, IConfiguration _configuration)
        {
            Oauth = oauthToken;
            configuration = _configuration;
        }

        public APIResult<LoginResponseModel> EmpLogin(EmpLoginRequestModel loginModel)
        {
            var result = new APIResult<LoginResponseModel>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                if (string.IsNullOrWhiteSpace(loginModel?.token))
                {
                    result.IsSuccess = false;
                    result.IsError = true;
                    result.Message = "Token is required.";
                    return result;
                }

                // Encode token
                loginModel.token = HttpUtility.UrlEncode(loginModel.token);
                Console.WriteLine("Encoded Token received from frontend: " + loginModel.token);

                var postData = JsonConvert.SerializeObject(loginModel);
                var url = $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_validateToken?company={HardcodedValues.CompanyName}";

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, url, ParameterType.RequestBody, Oauth.Token, postData);

                if (!response.IsSuccessful)
                {
                    var error = JsonConvert.DeserializeObject<ErrorResponse>(response.Content);
                    result.IsSuccess = false;
                    result.IsError = true;
                    result.Message = error?.error?.message ?? "API call to BC failed.";
                    return result;
                }

                var responseModel = JsonConvert.DeserializeObject<EmpLoginResponseModel>(response.Content);

                if (string.IsNullOrWhiteSpace(responseModel?.value))
                {
                    result.IsSuccess = false;
                    result.IsError = true;
                    result.Message = "No value returned from Business Central.";
                    return result;
                }

                var parts = responseModel.value.Split(new[] { "##" }, StringSplitOptions.None);
                if (parts.Length < 5)
                {
                    result.IsSuccess = false;
                    result.IsError = true;
                    result.Message = "Invalid response format from Business Central.";
                    return result;
                }

                result.Value = new LoginResponseModel
                {
                    PersonResponsible = parts[0],
                    AssignedUserID = parts[2],
                    Email = parts[3],
                    Contact = parts[4],
                    isEmployee = true
                };

                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.IsError = true;
                result.ExceptionInformation = ex;
                result.Message = "An exception occurred during employee login.";
            }

            return result;
        }


        public APIResult<List<CountryRegionModel>> GetCountryOrigin()
        {
            APIResult<List<CountryRegionModel>> returnValue = new APIResult<List<CountryRegionModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}countryoforigins?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var countryResponse = JsonConvert.DeserializeObject<ODataResponse<List<CountryRegionModel>>>(response);
                    if (countryResponse != null && countryResponse.Value != null && countryResponse.Value.Any() && countryResponse.Value.Count > 0)
                    {
                        returnValue.Value = countryResponse.Value;
                    }
                    else
                    {
                        returnValue.IsSuccess = false;
                    }
                }
                else
                {
                    returnValue.IsSuccess = false;
                }
            }
            catch (Exception exception)
            {
                returnValue.IsSuccess = false;
                returnValue.IsError = true;
                returnValue.ExceptionInformation = exception;
            }
            return returnValue;
        }

        public APIResult<List<CommodityModel>> GetCommodityCodes()
        {
            APIResult<List<CommodityModel>> returnValue = new APIResult<List<CommodityModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}commoditycodes?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var countryResponse = JsonConvert.DeserializeObject<ODataResponse<List<CommodityModel>>>(response);
                    if (countryResponse != null && countryResponse.Value != null && countryResponse.Value.Any() && countryResponse.Value.Count > 0)
                    {
                        returnValue.Value = countryResponse.Value;
                    }
                    else
                    {
                        returnValue.IsSuccess = false;
                    }
                }
                else
                {
                    returnValue.IsSuccess = false;
                }
            }
            catch (Exception exception)
            {
                returnValue.IsSuccess = false;
                returnValue.IsError = true;
                returnValue.ExceptionInformation = exception;
            }
            return returnValue;
        }
    }
}
