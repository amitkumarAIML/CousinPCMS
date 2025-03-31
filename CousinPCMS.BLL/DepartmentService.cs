using Akkomplish.Framework;
using CousinPCMS.Domain;
using Newtonsoft.Json;
using RestSharp;

namespace CousinPCMS.BLL
{
    public class DepartmentService
    {
        OauthToken Oauth;
        public DepartmentService(OauthToken oauthToken)
        {
            Oauth = oauthToken;
        }

        public APIResult<List<DepartmentModel>> GetAllDepartment()
        {
            APIResult<List<DepartmentModel>> returnValue = new APIResult<List<DepartmentModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}departments?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<DepartmentModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<string> UpdateDepartment(DepartmentModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var urlToQuery = $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}departments({objModel.AkiDepartmentID})?company={HardcodedValues.CompanyName}";

                RestClient client = new RestClient();
                RestRequest request = new RestRequest(urlToQuery);

                request.Method = Method.Patch;
                request.AddHeader("Authorization", "Bearer " + Oauth.Token);
                request.AddHeader("If-Match", "*");
                request.AddHeader("Content-Type", "application/json");

                if (!string.IsNullOrEmpty(postData))
                {
                    request.AddBody(postData, ContentType.Json);
                }

                var response = client.Execute(request);

                if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = "Success";
                }
                else
                {
                    returnValue.IsSuccess = false;
                    var errorResponse = JsonConvert.DeserializeObject<dynamic>(response.Content);
                    returnValue.Value = errorResponse?.error?.message ?? "Unknown error occurred.";
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
