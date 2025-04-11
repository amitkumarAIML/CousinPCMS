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

        public APIResult<List<ProductModel>> GetProductById(string akiProductID)
        {
            APIResult<List<ProductModel>> returnValue = new APIResult<List<ProductModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();

                allFilters.Add(new Filters { ParameterName = "akiProductID", ParameterValue = akiProductID, DataType = typeof(int), Compare = ComparisonType.Equals });

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

        public APIResult<List<ProductLinkedURlModel>> GetProductUrls(string ProductId)
        {
            APIResult<List<ProductLinkedURlModel>> returnValue = new APIResult<List<ProductLinkedURlModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>
                {
                    new Filters
                    {
                        ParameterName = "productID",
                        ParameterValue = ProductId,
                        DataType = typeof(int),
                        Compare = ComparisonType.Equals
                    }
                };

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}Producturls?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var ProductResponse = JsonConvert.DeserializeObject<ODataResponse<List<ProductLinkedURlModel>>>(response);
                    if (ProductResponse != null && ProductResponse.Value != null && ProductResponse.Value.Any() && ProductResponse.Value.Count > 0)
                    {
                        returnValue.Value = ProductResponse.Value;
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

        public APIResult<List<ProductAdditionalImageModel>> GetProductAdditionalImages(string ProductId)
        {
            APIResult<List<ProductAdditionalImageModel>> returnValue = new APIResult<List<ProductAdditionalImageModel>>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>
                {
                    new Filters
                    {
                        ParameterName = "productID",
                        ParameterValue = ProductId,
                        DataType = typeof(int),
                        Compare = ComparisonType.Equals
                    }
                };

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                var response = ServiceClient.PerformAPICallWithToken(Method.Get, $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}Productadditionalimages?company={HardcodedValues.CompanyName}", ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var ProductResponse = JsonConvert.DeserializeObject<ODataResponse<List<ProductAdditionalImageModel>>>(response);
                    if (ProductResponse != null && ProductResponse.Value != null && ProductResponse.Value.Any() && ProductResponse.Value.Count > 0)
                    {
                        returnValue.Value = ProductResponse.Value;
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

        public APIResult<string> DeleteProductLinkUrl(DeleteProductURLRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteProductURL?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> DeleteProductAdditionalImage(DeleteProductImageRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteProductAdditionalImages?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> AddProductAdditionalImage(AddProductAdditionalImageRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddProductAdditionalImages?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> AddProductLinkUrls(AddProductAdditionalLinkUrlRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddProductURL?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> UpdateAssociatedProduct(AdditionalProductRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_UpdateAddProductsProductListOrder?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<string> AddAssociatedProduct(AdditionalProductRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_AddDataAddProdForProduct?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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

        public APIResult<List<AdditionalProductModel>> GetAdditionalProduct(string productId)
        {
            APIResult<List<AdditionalProductModel>> returnValue = new APIResult<List<AdditionalProductModel>>
            {
                IsError = false,
                IsSuccess = true,
                Value = new List<AdditionalProductModel>()
            };

            try
            {
                var allFilters = new List<Filters>
                {
                    new Filters
                    {
                        ParameterName = "product",
                        ParameterValue = productId,
                        DataType = typeof(int),
                        Compare = ComparisonType.Equals
                    }
                };

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                // Fetch Additional Category Data
                var response = ServiceClient.PerformAPICallWithToken(
                    Method.Get,
                    $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}additionalproductsforproducts?company={HardcodedValues.CompanyName}{filter}",
                    ParameterType.GetOrPost,
                    Oauth.Token
                ).Content;

                if (!string.IsNullOrEmpty(response))
                {
                    var responseOfOrderLine = JsonConvert.DeserializeObject<ODataResponse<List<AdditionalProductModel>>>(response);

                    if (responseOfOrderLine?.Value != null && responseOfOrderLine.Value.Any())
                    {
                        returnValue.Value.AddRange(responseOfOrderLine.Value);
                    }
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

        public APIResult<string> DeleteAssociatedProduct(DeleteAssociatedProductRequestModel objModel)
        {
            APIResult<string> returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(objModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}ProductCousinsProcess_DeleteAddProductsProduct?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

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
