using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class AttributesModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public string attributeName { get; set; }
        public string attributeDescription { get; set; } = string.Empty;
        public string searchType { get; set; } = string.Empty;
        public bool showAsCategory { get; set; }
        public bool attributesIsActive { get; set; }
    }

    public class AttributeValuesModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public string attributeValue { get; set; }
        public string attributeName { get; set; }
        public string newAlternateValue { get; set; } = string.Empty;
        public string alternateValues { get; set; } = string.Empty;
        public bool attributevalueIsActive { get; set; }
        public bool attributeValueLinkedToSKU { get; set; }
    }

    public class AttributeSetModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public string attributeSetName { get; set; }
        public string attributeName { get; set; }
        public string akiCategoryID { get; set; }
        public bool attributeRequired { get; set; }
        public bool notImportant { get; set; }
        public int listPosition { get; set; }
        public bool attributesetIsActive { get; set; }
    }

    public class AddAttributeRequestModel
    {
        public string attributeName { get; set; }
        public string attributeDescription { get; set; } = string.Empty;
        public string searchType { get; set; } = string.Empty;
        public bool showAsCategory { get; set; }
    }
    public class AddAttributeValueRequestModel
    {
        public string attributeValue { get; set; }
        public string attributeName { get; set; }
        public string newAlternateValue { get; set; } = string.Empty;
        public string alternateValues { get; set; } = string.Empty;
    }
    public class AddAttributeSetRequestModel
    {
        public string attributeSetName { get; set; }
        public string attributeName { get; set; }
        public string categoryID { get; set; }
        public bool attributeRequired { get; set; }
        public bool notImportant { get; set; }
        public int listPosition { get; set; }
    }

    public class UpdateAttributeSetRequestModel
    {
        public string attributeSetName { get; set; }
        public string attributeName { get; set; }
        public string categoryID { get; set; }
        public bool attributeRequired { get; set; }
        public bool notImportant { get; set; }
        public int listPosition { get; set; }
    }

    public class DeleteAttributeRequestModel
    {
        public string attributeName { get; set; }
    }
    public class DeleteAttributeValueRequestModel
    {
        public string attributeValue { get; set; }
        public string attributeName { get; set; }
    }
    public class DeleteAttributeSetRequestModel
    {
        public string attributeSetName { get; set; }
        public string attributeName { get; set; }
    }
}
