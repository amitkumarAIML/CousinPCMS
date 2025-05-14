namespace CousinPCMS.Domain;

public class APIResult<T>
{
    public T Value { get; set; }
    public required bool IsSuccess { get; set; }
    public required bool IsError { get; set; }
    public string Message { get; set; }
    public Exception? ExceptionInformation { get; set; }
}