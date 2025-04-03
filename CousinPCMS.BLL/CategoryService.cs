using Akkomplish.Framework;
using CousinPCMS.Domain;
using Newtonsoft.Json;
using RestSharp;

namespace CousinPCMS.BLL
{
    public class CategoryService
    {
        OauthToken Oauth;
        public CategoryService(OauthToken oauthToken)
        {
            Oauth = oauthToken;
        }

        public APIResult<List<CategoryModel>> GetAllCategory()
        {
            APIResult<List<CategoryModel>> returnValue = new APIResult<List<CategoryModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}categorys?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<CategoryModel>>>(response);
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

        public APIResult<List<CategoryModel>> GetAllCategoryBYDeptId(string deptId)
        {
            APIResult<List<CategoryModel>> returnValue = new APIResult<List<CategoryModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "AKIDepartment", ParameterValue = deptId, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}categorys?company={HardcodedValues.CompanyName}{filter}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<CategoryModel>>>(response);
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

        public APIResult<CategoryModel> UpdateCategory(AddCategoryRequestModel objModel)
        {
            APIResult<CategoryModel> returnValue = new APIResult<CategoryModel>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var urlToQuery = $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}categorys({objModel.akiCategoryID})?company={HardcodedValues.CompanyName}";

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

                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var objResponse = JsonConvert.DeserializeObject<CategoryModel>(response.Content);
                    returnValue.IsSuccess = true;
                    returnValue.Value = objResponse;
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

        public APIResult<AdditionalCategoryModel> UpdateAssociatedProduct(AssociatedProductRequestModel objModel)
        {
            APIResult<AdditionalCategoryModel> returnValue = new APIResult<AdditionalCategoryModel>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var urlToQuery = $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}additionalproducts(Product ={objModel.Product},additionalcategory={objModel.additionalCategory})?company={HardcodedValues.CompanyName}";

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

                if (response.StatusCode == System.Net.HttpStatusCode.OK)
                {
                    var objResponse = JsonConvert.DeserializeObject<AdditionalCategoryModel>(response.Content);
                    returnValue.IsSuccess = true;
                    returnValue.Value = objResponse;
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

        public APIResult<string> AddAssociatedProduct(AssociatedProductRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}additionalproducts(Product ={objModel.Product},additionalcategory={objModel.additionalCategory})?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<List<LinkedAttributeModel>> GetLinkedAttributes()
        {
            APIResult<List<LinkedAttributeModel>> returnValue = new APIResult<List<LinkedAttributeModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}linkedattributes?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<LinkedAttributeModel>>>(response);
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

        public APIResult<List<AdditionalCategoryModel>> GetAdditionalCategory(string categoryId)
        {
            APIResult<List<AdditionalCategoryModel>> returnValue = new APIResult<List<AdditionalCategoryModel>>
            {
                IsError = false,
                IsSuccess = true,
                Value = new List<AdditionalCategoryModel>()
            };

            try
            {
                var allFilters = new List<Filters>
                {
                    new Filters
                    {
                        ParameterName = "additionalCategory",
                        ParameterValue = categoryId,
                        DataType = typeof(string),
                        Compare = ComparisonType.Equals
                    }
                };

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                // Fetch Additional Category Data
                var response = ServiceClient.PerformAPICallWithToken(
                    Method.Get,
                    $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}additionalproducts?company={HardcodedValues.CompanyName}{filter}",
                    ParameterType.GetOrPost,
                    Oauth.Token
                ).Content;

                // Fetch Product Data
                var pservice = new ProductService(Oauth);
                var category = pservice.GetProductsByCategory(categoryId);

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AdditionalCategoryModel>>>(response);

                    if (responseOfOrderLine?.Value != null && responseOfOrderLine.Value.Any())
                    {
                        returnValue.Value.AddRange(responseOfOrderLine.Value);
                    }
                }

                if (category?.Value != null && category.Value.Any())
                {
                    var products = category.Value.Select(additionalCategory => new AdditionalCategoryModel
                    {
                        AdditionalCategory = additionalCategory.akiCategoryID,
                        Product = additionalCategory.akiProductID,
                        ListOrder = additionalCategory.akiProductListOrder,
                        ProductName = additionalCategory.akiProductName,
                        CategoryName = additionalCategory.Category_Name,
                        WebActive = additionalCategory.akiProductWebActive
                    }).ToList();

                    returnValue.Value.AddRange(products);
                }
                returnValue.IsSuccess = true;
            }
            catch (Exception exception)
            {
                returnValue.IsSuccess = false;
                returnValue.IsError = true;
                returnValue.ExceptionInformation = exception;
            }

            return returnValue;
        }

        public APIResult<List<CategoryLayoutModel>> GetCategoryLayouts()
        {
            APIResult<List<CategoryLayoutModel>> returnValue = new APIResult<List<CategoryLayoutModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}categorylayouts?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var categoryResponse = JsonConvert.DeserializeObject<ODataResponse<List<CategoryLayoutModel>>>(response);
                    if (categoryResponse != null && categoryResponse.Value != null && categoryResponse.Value.Any() && categoryResponse.Value.Count > 0)
                    {
                        returnValue.Value = categoryResponse.Value;
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

        public APIResult<string> DeleteCategory(DeleteCategoryRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteCategory?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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
