namespace CousinPCMS.Domain;

public class LoginModel
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class EmpLoginRequestModel
{
    public string token { get; set; }
}
