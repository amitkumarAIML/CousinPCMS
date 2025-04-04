using Akkomplish.Framework;
using CousinPCMS.Domain;
using Newtonsoft.Json;
using RestSharp;

namespace CousinPCMS.BLL
{
    public class ProductService
    {
        OauthToken Oauth;
        public ProductService(OauthToken oauthToken)
        {
            Oauth = oauthToken;
        }

        public APIResult<List<ProductModel>> GetAllProducts()
        {
            APIResult<List<ProductModel>> returnValue = new APIResult<List<ProductModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}products?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<ProductModel>>>(response);
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

        public APIResult<List<ProductModel>> GetProductsByCategory(string akiCategoryID)
        {
            APIResult<List<ProductModel>> returnValue = new APIResult<List<ProductModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "akiCategoryID", ParameterValue = akiCategoryID, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}products?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<ProductModel>>>(response);
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

        public APIResult<List<ProductLayoutModel>> GetProductLayouts()
        {
            APIResult<List<ProductLayoutModel>> returnValue = new APIResult<List<ProductLayoutModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}productlayouts?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var productResponse = JsonConvert.DeserializeObject<ODataResponse<List<ProductLayoutModel>>>(response);
                    if (productResponse != null && productResponse.Value != null && productResponse.Value.Any() && productResponse.Value.Count > 0)
                    {
                        returnValue.Value = productResponse.Value;
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

        public APIResult<string> DeleteProduct(DeleteProductRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteProduct?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> UpdateProduct(UpdateProductModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_UpdateProduct?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

    }
}
