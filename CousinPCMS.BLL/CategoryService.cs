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
                        AdditionalCategory = additionalCategory.AkiCategoryID,
                        Product = additionalCategory.AkiProductID,
                        ListOrder = additionalCategory.AkiProductListOrder,
                        ProductName = additionalCategory.AkiProductName,
                        CategoryName = additionalCategory.Category_Name,
                        WebActive = additionalCategory.AkiProductWebActive
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
    }
}
