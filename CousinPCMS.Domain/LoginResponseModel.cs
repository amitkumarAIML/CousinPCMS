using Newtonsoft.Json;

namespace CousinPCMS.Domain;

public class LoginResponseModel
{
    [JsonProperty("@odata.etag")]
    public string OdataEtag { get; set; }

    public string Email { get; set; }
    public string Contact { get; set; }
    public string AssignedUserID { get; set; }
    public bool PortalEnabled { get; set; }
    public bool isEmployee { get; set; }
    public string PersonResponsible { get; set; }
}
public class EmpLoginResponseModel
{

    [JsonProperty("@odata.context")]
    public string odatacontext { get; set; }
    public string value { get; set; }
}
public class ErrorDetail
{
    public string code { get; set; }
    public string message { get; set; }
}

public class ErrorResponse
{
    public ErrorDetail error { get; set; }
}