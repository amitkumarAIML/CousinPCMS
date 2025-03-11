using Newtonsoft.Json;

namespace CousinPCMS.Domain;

public class ResetPasswordRequestModel
{
    [JsonProperty("email")]
    public string Email { get; set; }
}

public class ResetPasswordResponseModel
{
    public string value { get; set; }
}