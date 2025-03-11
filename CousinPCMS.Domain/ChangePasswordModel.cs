namespace CousinPCMS.Domain;

public class ChangePasswordModel
{
    public required bool IsVendor { get; set; }
    public string No { get; set; }
    public string Email { get; set; }
    public required string OldPassword { get; set; }
    public required string Password { get; set; }
    public required bool ResetLock { get; set; }
}
