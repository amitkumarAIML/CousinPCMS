using Microsoft.Identity.Client;
using System.Text;
using CousinPCMS.Domain;

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
        if (filters != null && filters.Any() && filters.Count > 0)
        {
            stringBuilder.Append("&$filter=");
            if (typeof(String) == filters[0].DataType)
            {
                stringBuilder.Append(filters[0].ParameterName);
                stringBuilder.Append(" eq '");
                stringBuilder.Append(filters[0].ParameterValue);
                stringBuilder.Append("'");
            }
            else if (typeof(int) == filters[0].DataType)
            {
                stringBuilder.Append(filters[0].ParameterName);
                stringBuilder.Append(" eq ");
                stringBuilder.Append(filters[0].ParameterValue);
            }
            var counter = 0;
            foreach (Filters filter in filters)
            {
                if (counter == 0)
                {
                    counter++;
                    continue;
                }
                else
                {
                    stringBuilder.Append(" and ");
                    if (typeof(String) == filter.DataType)
                    {
                        stringBuilder.Append(filter.ParameterName);
                        if (filter.Compare == ComparisonType.Equals)
                        {
                            stringBuilder.Append(" eq '");
                        }
                        stringBuilder.Append(filter.ParameterValue);
                        stringBuilder.Append("'");
                    }
                    else if (typeof(int) == filter.DataType)
                    {
                        stringBuilder.Append(filter.ParameterName);
                        stringBuilder.Append(" eq ");
                        stringBuilder.Append(filter.ParameterValue);
                    }
                }
            }
        }
        return stringBuilder.ToString();
    }
}