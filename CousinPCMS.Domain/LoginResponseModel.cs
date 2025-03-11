using Newtonsoft.Json;

namespace CousinPCMS.Domain;

public class LoginResponseModel
{
    [JsonProperty("@odata.etag")]
    public string OdataEtag { get; set; }
    [JsonProperty("No_")]
    public string No { get; set; }
    public string VendorNo { get; set; }
    public string CustomerNo { get; set; }

    public string Email { get; set; }
    public string Contact { get; set; }
    public string AssignedUserID { get; set; }
    public bool isVendor { get; set; }
    public bool isCustomer { get; set; }
    public bool PortalEnabled { get; set; }
    public bool isEmployee { get; set; }
    public string agentCode { get; set; }
    public string PersonResponsible { get; set; }
    public string Name { get; set; }
}
public class EmpLoginResponseModel
{

    [JsonProperty("@odata.etag")]
    public string odataetag { get; set; }
    public string value { get; set; }
}