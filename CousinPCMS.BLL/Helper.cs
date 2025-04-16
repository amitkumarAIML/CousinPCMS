using CousinPCMS.Domain;
using Microsoft.Identity.Client;
using System.Text;

namespace CousinPCMS.BLL;

public static class Helper
{
    public static OauthToken GetOauthToken(OauthToken oauthToken)
    {
        bool requiretoken = false;
        if (oauthToken == null)
        {
            oauthToken = new OauthToken
            {
                Token = "",
                TokenExpiry = DateTime.MinValue
            };
            requiretoken = true;
        }
        else
        {
            if (oauthToken.Token == "")
            {
                requiretoken = true;
            }
            if (oauthToken.TokenExpiry == DateTime.MinValue)
            {
                requiretoken = true;
            }
            else
            {
                if (oauthToken.TokenExpiry <= DateTime.Now)
                {
                    requiretoken = true;
                }
            }
        }

        if (!requiretoken)
        {
            return oauthToken;
        }
        else
        {
            var scopes = new[] { "https://api.businesscentral.dynamics.com/.default" };

            var authorityUri = $"https://login.microsoftonline.com/{HardcodedValues.TenantId}/oauth2/v2.0/token";

            var confidentialClient = ConfidentialClientApplicationBuilder
                .Create(HardcodedValues.ClientId)
                .WithClientSecret(HardcodedValues.ClientSecret)
                .WithAuthority(new Uri(authorityUri))
                .Build();

            var accessTokenRequest = confidentialClient.AcquireTokenForClient(scopes);
            var result = accessTokenRequest.ExecuteAsync().Result;
            var accessToken = result.AccessToken;
            oauthToken.Token = accessToken;
            oauthToken.TokenExpiry = result.ExpiresOn.LocalDateTime;
            return oauthToken;
        }
    }

    /// <summary>
    /// Currently supports generating expression for 'and' query and only 2 types, string and int
    /// </summary>
    /// <param name="filters"></param>
    /// <returns>Expression</returns>
    public static string GenerateFilterExpressionForAnd(List<Filters> filters)
    {
        StringBuilder stringBuilder = new StringBuilder();

        if (filters != null && filters.Any())
        {
            stringBuilder.Append("&$filter=");

            for (int i = 0; i < filters.Count; i++)
            {
                var filter = filters[i];

                if (i > 0)
                    stringBuilder.Append(" and ");

                if (filter.DataType == typeof(string))
                {
                    if (filter.Compare == ComparisonType.Equals)
                    {
                        stringBuilder.Append($"{filter.ParameterName} eq '{filter.ParameterValue}'");
                    }
                    else if (filter.Compare == ComparisonType.Contains)
                    {
                        stringBuilder.Append($"contains({filter.ParameterName},'{filter.ParameterValue}')");
                    }
                    else
                    {
                        // Fallback to equals if unknown compare type
                        stringBuilder.Append($"{filter.ParameterName} eq '{filter.ParameterValue}'");
                    }
                }
                else if (filter.DataType == typeof(int))
                {
                    stringBuilder.Append($"{filter.ParameterName} eq {filter.ParameterValue}");
                }
                // Add other types like DateTime, bool etc. here if needed
            }
        }

        return stringBuilder.ToString();
    }

}