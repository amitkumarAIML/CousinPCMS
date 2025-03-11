using System.Runtime.Serialization;

namespace CousinPCMS.Domain;

public class ODataResponse<T>
{
    public ODataResponse() { }
    public string OdataContext { get; set; }

    [DataMember]
    public T? Value { get; set; }
}