﻿using Akkomplish.Framework;
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
                    var departmentResponse = JsonConvert.DeserializeObject<ODataResponse<List<DepartmentModel>>>(response);
                    if (departmentResponse != null && departmentResponse.Value != null && departmentResponse.Value.Any() && departmentResponse.Value.Count > 0)
                    {
                        returnValue.Value = departmentResponse.Value;
                    }
                    else
                    {
                        returnValue.IsSuccess = true;
                    }
                }
                else
                {
                    returnValue.IsSuccess = true;
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

        public APIResult<List<DepartmentModel>> GetDepartmentById(string deptId)
        {
            APIResult<List<DepartmentModel>> returnValue = new APIResult<List<DepartmentModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {

                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "akiDepartmentID", ParameterValue = deptId, DataType = typeof(int), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);


                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}departments?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var departmentResponse = JsonConvert.DeserializeObject<ODataResponse<List<DepartmentModel>>>(response);
                    if (departmentResponse != null && departmentResponse.Value != null && departmentResponse.Value.Any() && departmentResponse.Value.Count > 0)
                    {
                        returnValue.Value = departmentResponse.Value;
                    }
                    else
                    {
                        returnValue.IsSuccess = true;
                    }
                }
                else
                {
                    returnValue.IsSuccess = true;
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

        public APIResult<List<DepartmentLayoutModel>> GetDepartmentLayouts()
        {
            APIResult<List<DepartmentLayoutModel>> returnValue = new APIResult<List<DepartmentLayoutModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}departmentlayouts?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var departmentResponse = JsonConvert.DeserializeObject<ODataResponse<List<DepartmentLayoutModel>>>(response);
                    if (departmentResponse != null && departmentResponse.Value != null && departmentResponse.Value.Any() && departmentResponse.Value.Count > 0)
                    {
                        returnValue.Value = departmentResponse.Value;
                    }
                    else
                    {
                        returnValue.IsSuccess = true;
                    }
                }
                else
                {
                    returnValue.IsSuccess = true;
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

        public APIResult<string> UpdateDepartment(UpdateDepartmentRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_UpdateDepartment?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

                if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = "Success";
                }
                else
                {
                    returnValue.IsSuccess = false;
                    // Extract "message" field from JSON response if available
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

        public APIResult<string> DeleteDepartment(DeleteDepartmentRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteDepartment?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

                if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = "Success";
                }
                else
                {
                    returnValue.IsSuccess = false;
                    // Extract "message" field from JSON response if available
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

        public APIResult<int> AddDepartment(AddDepartmentRequestModel objModel)
        {
            APIResult<int> returnValue = new APIResult<int>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(
                    Method.Post,
                    $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_InsertDepartment?company={HardcodedValues.CompanyName}",
                    ParameterType.RequestBody,
                    Oauth.Token,
                    postData
                );

                if (response.StatusCode == System.Net.HttpStatusCode.OK || response.StatusCode == System.Net.HttpStatusCode.Created)
                {
                    // Parse the response and extract the integer value
                    var jsonResponse = JsonConvert.DeserializeObject<dynamic>(response.Content);
                    returnValue.Value = (int)jsonResponse.value;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
                {
                    returnValue.Value = 0; // No content, but still considered success
                }
                else
                {
                    returnValue.IsSuccess = false;
                    var errorResponse = JsonConvert.DeserializeObject<dynamic>(response.Content);
                    returnValue.ExceptionInformation = errorResponse?.error?.message ?? "Unknown error occurred.";
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
