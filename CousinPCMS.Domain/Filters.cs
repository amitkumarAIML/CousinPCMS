namespace CousinPCMS.Domain;

public class Filters
{
    public required string ParameterName { get; set; }
    public required string ParameterValue { get; set; }
    public required ComparisonType Compare { get; set; }
    public Type DataType { get; set; }
}

public enum ComparisonType
{
    Equals,
    NotEquals,
    GreaterThan,
    LessThan,
    Contains,
}

public enum PaymentFilterEnum
{
    All = 1,
    Open = 2,
    Close = 3
}