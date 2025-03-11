namespace CousinPCMS.Domain;

public class OauthToken
{

    public required string Token { get; set; }
    public required DateTime TokenExpiry { get; set; }
}
