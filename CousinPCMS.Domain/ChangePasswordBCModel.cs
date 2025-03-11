using Newtonsoft.Json;

namespace CousinPCMS.Domain;

public class ChangePasswordBCModel
{
    [JsonProperty("isVendor")]
    public bool IsVendor { get; set; }
    [JsonProperty("no")]
    public string No { get; set; }
    [JsonProperty("password")]
    public string Password { get; set; }
    [JsonProperty("resetLock")]
    public bool ResetLock { get; set; }
}
