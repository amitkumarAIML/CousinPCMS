using Akkomplish.Framework;
using CousinPCMS.Domain;
using Newtonsoft.Json;
using RestSharp;

namespace CousinPCMS.BLL
{
    public class AttributeService
    {
        OauthToken Oauth;
        public AttributeService(OauthToken oauthToken)
        {
            Oauth = oauthToken;
        }

        public APIResult<List<AttributesModel>> GetAllAttributes()
        {
            APIResult<List<AttributesModel>> returnValue = new APIResult<List<AttributesModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributes?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributesModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributesModel>> GetAllAttributesByAttributeName(string attributeName)
        {
            APIResult<List<AttributesModel>> returnValue = new APIResult<List<AttributesModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "attributeName", ParameterValue = attributeName, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributes?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributesModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributeValuesModel>> GetAllAttributeValues()
        {
            APIResult<List<AttributeValuesModel>> returnValue = new APIResult<List<AttributeValuesModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributevalues?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributeValuesModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributeValuesModel>> GetAllAttributeValuesByAttribute(string attributeName)
        {
            APIResult<List<AttributeValuesModel>> returnValue = new APIResult<List<AttributeValuesModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "attributeName", ParameterValue = attributeName, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributevalues?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributeValuesModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributeSetModel>> GetAllAttributeSets()
        {
            APIResult<List<AttributeSetModel>> returnValue = new APIResult<List<AttributeSetModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributesets?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributeSetModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributeSetModel>> GetAllAttributeSetsByAttribute(string attributeName)
        {
            APIResult<List<AttributeSetModel>> returnValue = new APIResult<List<AttributeSetModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "attributeName", ParameterValue = attributeName, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributesets?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributeSetModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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

        public APIResult<List<AttributeSetModel>> GetAttributeSetsByCategoryId(string CategoryId)
        {
            APIResult<List<AttributeSetModel>> returnValue = new APIResult<List<AttributeSetModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "akiCategoryID", ParameterValue = CategoryId, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributesets?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AttributeSetModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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
        public APIResult<string> AddAttributes(AddAttributeRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddAttributes?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> UpdateAttributes(AddAttributeRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_UpdateAttribute?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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
        public APIResult<string> AddAttributeValues(AddAttributeValueRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddAttributeValue?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> AddAttributeSets(AddAttributeSetRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddAttributeset?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> UpdateAttributeSets(UpdateAttributeSetRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_UpdateAttributeset?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> DeleteAttribute(DeleteAttributeRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteAttributes?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> DeleteAttributeValue(DeleteAttributeValueRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteAttributesValue?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> DeleteAttributeSets(DeleteAttributeSetRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteAttributeset?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<List<DropdownListModel>> GetAttributeSearchTypes()
        {
            APIResult<List<DropdownListModel>> returnValue = new APIResult<List<DropdownListModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}attributesearchtypes?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<DropdownListModel>>>(response);
                    if (responseOfOrderLine != null && responseOfOrderLine.Value != null && responseOfOrderLine.Value.Any() && responseOfOrderLine.Value.Count > 0)
                    {
                        returnValue.Value = responseOfOrderLine.Value;
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
    }
}
