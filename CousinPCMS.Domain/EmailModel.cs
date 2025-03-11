namespace CousinPCMS.Domain;

public class EmailModel
{
    public string toEmail { get; set; }
    public string cCEmail { get; set; }
    public string subject { get; set; }
    public string body { get; set; }

}

// Email template model
public class EmailTemplateModel
{
    public string Subject { get; set; }
    public string Body { get; set; }
}