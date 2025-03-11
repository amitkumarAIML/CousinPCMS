using Akkomplish.Framework;
using CousinPCMS.Domain;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;

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

        public APIResult<LoginResponseModel> Login(LoginModel loginModel)
        {
            APIResult<LoginResponseModel> returnValue = new APIResult<LoginResponseModel>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var allFilters = new List<Filters>();
                allFilters.Add(new Filters { ParameterName = "email", ParameterValue = loginModel.Email, DataType = typeof(string), Compare = ComparisonType.Equals });
                allFilters.Add(new Filters { ParameterName = "portalpassword", ParameterValue = loginModel.Password, DataType = typeof(string), Compare = ComparisonType.Equals });

                var filter = Helper.GenerateFilterExpressionForAnd(allFilters);

                LoginResponseModel vendors = null;
                LoginResponseModel customers = null;

                // Fetch vendor details
                var vendorResponse = ServiceClient.PerformAPICallWithToken(
                    Method.Get,
                    $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}vendors?company={HardcodedValues.CompanyName}{filter}",
                    ParameterType.GetOrPost,
                    Oauth.Token).Content;

                if (!string.IsNullOrEmpty(vendorResponse))
                {
                    var vendorResponseData = JsonConvert.DeserializeObject<ODataResponse<List<LoginResponseModel>>>(vendorResponse);
                    if (vendorResponseData?.Value?.Any() == true)
                    {
                        vendors = vendorResponseData.Value[0];

                        if (vendors.PortalEnabled)
                        {
                            //var sfilter = "&$filter=VendorNo eq '" + vendors.No + "'";

                            //var shippingAgent = ServiceClient.PerformAPICallWithToken(
                            //                              Method.Get,
                            //                              $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}shippingagents?company={HardcodedValues.CompanyName}{sfilter}",
                            //                              ParameterType.GetOrPost,
                            //                              Oauth.Token).Content;

                            //var shippingAgentResponse = JsonConvert.DeserializeObject<ODataResponse<List<ShippingAgentModel>>>(shippingAgent);

                            //if (shippingAgentResponse?.Value?.Any() == true)
                            //{
                            //    vendors.agentCode = shippingAgentResponse.Value[0].code;
                            //}
                            vendors.VendorNo = vendors.No;
                            vendors.isVendor = true;
                        }
                        else
                            vendors = null;
                    }
                }

                // Fetch customer details
                var customerResponse = ServiceClient.PerformAPICallWithToken(
                    Method.Get,
                    $"{HardcodedValues.PrefixBCUrl}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCUrl}customers?company={HardcodedValues.CompanyName}{filter}",
                    ParameterType.GetOrPost, Oauth.Token).Content;

                if (!string.IsNullOrEmpty(customerResponse))
                {
                    var customerResponseData = JsonConvert.DeserializeObject<ODataResponse<List<LoginResponseModel>>>(customerResponse);
                    if (customerResponseData?.Value?.Any() == true)
                    {
                        customers = customerResponseData.Value[0];
                        if (customers.PortalEnabled)
                        {
                            customers.CustomerNo = customers.No;
                            customers.isCustomer = true;
                        }
                        else
                            customers = null;
                    }
                }

                if (vendors != null && customers != null)
                {
                    customers.isVendor = true;
                    customers.VendorNo = vendors.No;
                    customers.agentCode = vendors.agentCode;

                    returnValue.IsSuccess = true;
                    returnValue.Value = customers;
                }
                else if (vendors != null)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = vendors;
                }
                else if (customers != null)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = customers;
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

        public APIResult<LoginResponseModel> EmpLogin(EmpLoginRequestModel loginModel)
        {
            APIResult<LoginResponseModel> returnValue = new APIResult<LoginResponseModel>
            {
                IsError = false,
                IsSuccess = true,
            };
            try
            {
                var postData = JsonConvert.SerializeObject(loginModel);

                var response = ServiceClient.PerformAPICallWithToken(Method.Post, $"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_validateToke?company={HardcodedValues.CompanyName}", ParameterType.RequestBody, Oauth.Token, postData.ToString());

                if (response.IsSuccessful)
                {
                    var responseOfLogin = JsonConvert.DeserializeObject<EmpLoginResponseModel>(response.Content);
                    if (responseOfLogin != null && responseOfLogin.value != null)
                    {
                        // Split the string by "##"
                        string[] parts = responseOfLogin.value.Split(new string[] { "##" }, StringSplitOptions.None);

                        LoginResponseModel obj = new LoginResponseModel();

                        obj.VendorNo = "";
                        obj.isVendor = true;
                        obj.CustomerNo = "";
                        obj.isCustomer = true;
                        obj.PortalEnabled = true;
                        obj.PersonResponsible = parts[0];
                        obj.Email = parts[6];
                        obj.AssignedUserID = parts[3];
                        obj.Contact = parts[5];
                        obj.isEmployee = true;

                        returnValue.IsSuccess = true;
                        returnValue.Value = obj;
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

        public APIResult<LoginResponseModel> ChangePassword(ChangePasswordModel changePasswordModel)
        {
            var returnValue = new APIResult<LoginResponseModel>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                LoginModel loginModel = new LoginModel
                {
                    Password = changePasswordModel.OldPassword,
                    Email = changePasswordModel.Email
                };
                var loginResponse = Login(loginModel);

                if (loginResponse.IsSuccess && !string.IsNullOrEmpty(loginResponse.Value.No))
                {
                    if (loginResponse.Value.isVendor)
                    {
                        var vendorNo = loginResponse.Value.VendorNo;
                        ChangePasswordBCModel changePasswordBCModel = new ChangePasswordBCModel
                        {
                            IsVendor = changePasswordModel.IsVendor,
                            No = vendorNo,
                            Password = changePasswordModel.Password,
                            ResetLock = changePasswordModel.ResetLock
                        };
                        RestClient client = new RestClient();
                        var request = new RestRequest($"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_changePassword?company={HardcodedValues.CompanyName}", Method.Post);
                        request.AddHeader("If-Match", loginResponse.Value.OdataEtag);
                        request.AddHeader("Authorization", $"Bearer {Oauth.Token}");
                        request.AddParameter("application/json", JsonConvert.SerializeObject(changePasswordBCModel), ParameterType.RequestBody);
                        RestResponse response = client.Execute(request);
                        returnValue.Value = JsonConvert.DeserializeObject<LoginResponseModel>(response.Content);
                    }

                    if (loginResponse.Value.isCustomer)
                    {
                        var customerNo = loginResponse.Value.CustomerNo;
                        ChangePasswordBCModel changePasswordBCModel = new ChangePasswordBCModel
                        {
                            IsVendor = false,
                            No = customerNo,
                            Password = changePasswordModel.Password,
                            ResetLock = changePasswordModel.ResetLock
                        };
                        RestClient client = new RestClient();
                        var request = new RestRequest($"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_changePassword?company={HardcodedValues.CompanyName}", Method.Post);
                        request.AddHeader("If-Match", loginResponse.Value.OdataEtag);
                        request.AddHeader("Authorization", $"Bearer {Oauth.Token}");
                        request.AddParameter("application/json", JsonConvert.SerializeObject(changePasswordBCModel), ParameterType.RequestBody);
                        RestResponse response = client.Execute(request);
                        returnValue.Value = JsonConvert.DeserializeObject<LoginResponseModel>(response.Content);
                        if (response.IsSuccessful)
                        {
                            returnValue.IsSuccess = true;
                            returnValue.Value = loginResponse.Value;
                        }
                        else
                        {
                            returnValue.IsSuccess = false;
                            returnValue.Value = loginResponse.Value;
                        }
                    }
                }
                else
                {
                    returnValue.IsSuccess = false;
                    returnValue.Value = loginResponse.Value;
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

        public APIResult<string> ResetPassword(string Email)
        {
            var returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                ResetPasswordRequestModel changePasswordBCModel = new ResetPasswordRequestModel
                {
                    Email = Email
                };
                RestClient client = new RestClient();
                var request = new RestRequest($"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_resetPassword?company={HardcodedValues.CompanyName}", Method.Post);

                request.AddHeader("Authorization", $"Bearer {Oauth.Token}");
                request.AddParameter("application/json", JsonConvert.SerializeObject(changePasswordBCModel), ParameterType.RequestBody);
                RestResponse response = client.Execute(request);

                var apiResponse = JsonConvert.DeserializeObject<ResetPasswordResponseModel>(response.Content);
                if (apiResponse.value != "")
                {
                    var objEmail = CreateResetPasswordTemplate(Email, "", apiResponse.value);
                    var emailResponse = SendEmail(objEmail);

                    returnValue.IsSuccess = true;
                    returnValue.Value = apiResponse.value;
                }
                else
                {
                    returnValue.IsSuccess = false;
                    returnValue.Value = "failed " + apiResponse.value;
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

        public APIResult<string> SendEmail(EmailModel objEmail)
        {
            var returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                RestClient client = new RestClient();
                var request = new RestRequest($"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_sendEmail?company={HardcodedValues.CompanyName}", Method.Post);

                request.AddHeader("Authorization", $"Bearer {Oauth.Token}");
                request.AddParameter("application/json", JsonConvert.SerializeObject(objEmail), ParameterType.RequestBody);
                RestResponse response = client.Execute(request);

                var apiResponse = JsonConvert.DeserializeObject<ResetPasswordResponseModel>(response.Content);
                if (response.IsSuccessful == true)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = "Successful";
                }
                else
                {
                    returnValue.IsSuccess = false;
                    returnValue.Value = "failed";
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

        public EmailModel CreateResetPasswordTemplate(string email, string ccEmail, string temporaryPassword)
        {
            EmailModel response = new EmailModel();

            // Load email template and subject dynamically
            var emailTemplate = LoadEmailTemplate("ResetPasswordTemplate.html");

            // Replace meta tags with actual values
            var emailbodyWithReplacements = ReplaceMetaTags(emailTemplate.Body, new Dictionary<string, string>
                {
                    { "TemporaryPassword", temporaryPassword }
                });

            // Assign email details
            response.toEmail = email;
            response.cCEmail = ccEmail;
            response.subject = emailTemplate.Subject;
            response.body = emailbodyWithReplacements;

            return response;
        }

        private string ReplaceMetaTags(string templateBody, Dictionary<string, string> replacements)
        {
            foreach (var replacement in replacements)
            {
                string metaTag = $"<meta name=\"{replacement.Key}\" />";
                templateBody = templateBody.Replace(metaTag, replacement.Value);
            }
            return templateBody;
        }

        // Helper method to load email template
        private EmailTemplateModel LoadEmailTemplate(string templateName)
        {
            //string basePath = AppDomain.CurrentDomain.BaseDirectory;
            //string templatePath = "";
            //// Get the directory info and move up to the parent directory till CousinPCMS.API
            //DirectoryInfo directoryInfo = new DirectoryInfo(basePath);
            //while (directoryInfo != null && !string.Equals(directoryInfo.Name, "CousinPCMS.API", StringComparison.OrdinalIgnoreCase))
            //{
            //    directoryInfo = directoryInfo.Parent;
            //}

            //if (directoryInfo != null)
            //{
            //    templatePath = Path.Combine(directoryInfo.FullName, "EmailTemplates", templateName);
            //    Console.WriteLine(templatePath);
            //}
            //else
            //{
            //    Console.WriteLine("CousinPCMS.API folder not found in the path.");
            //}

            //  string templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "EmailTemplates", templateName);

            string templateFolderPath = configuration["TemplateFolderPath"];
            string templatePath = Path.Combine(templateFolderPath, templateName);

            if (!File.Exists(templatePath))
                throw new FileNotFoundException($"Template file '{templateName}' not found.");

            string templateContent = File.ReadAllText(templatePath);

            // Parse subject and body
            var subjectMarker = "<!--Subject-->";
            var bodyMarker = "<!--Body-->";
            int subjectStart = templateContent.IndexOf(subjectMarker) + subjectMarker.Length;
            int bodyStart = templateContent.IndexOf(bodyMarker) + bodyMarker.Length;

            string subject = templateContent.Substring(subjectStart, templateContent.IndexOf(bodyMarker) - subjectStart).Trim();
            string body = templateContent.Substring(bodyStart).Trim();

            return new EmailTemplateModel { Subject = subject, Body = body };
        }

        public APIResult<string> LockUser(string Email)
        {
            var returnValue = new APIResult<string>
            {
                IsError = false,
                IsSuccess = true,
            };

            try
            {
                ResetPasswordRequestModel changePasswordBCModel = new ResetPasswordRequestModel
                {
                    Email = Email
                };
                RestClient client = new RestClient();
                var request = new RestRequest($"{HardcodedValues.PrefixBCODataV4Url}{HardcodedValues.TenantId}{HardcodedValues.SuffixBCODataV4Url}PortalWebService_lockUser?company={HardcodedValues.CompanyName}", Method.Post);

                request.AddHeader("Authorization", $"Bearer {Oauth.Token}");
                request.AddParameter("application/json", JsonConvert.SerializeObject(changePasswordBCModel), ParameterType.RequestBody);
                RestResponse response = client.Execute(request);

                var apiResponse = JsonConvert.DeserializeObject<ResetPasswordResponseModel>(response.Content);
                if (response.IsSuccessful)
                {
                    returnValue.IsSuccess = true;
                    returnValue.Value = "User locked successfully";
                }
                else
                {
                    returnValue.IsSuccess = false;
                    returnValue.Value = "LockUser api failed";
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
