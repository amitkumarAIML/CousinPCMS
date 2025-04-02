using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class SkusModel
    {
    }
    public class RelatedSkusModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("itemNo")]
        public string ItemNo { get; set; }

        [JsonProperty("relatedItemNo")]
        public string RelatedItemNo { get; set; }

        [JsonProperty("relationType")]
        public string RelationType { get; set; }
    }
    public class DeleteSkusRequestModel
    {
        public int skuITEMNO { get; set; }
    }

    public class SkusRelationTypeModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("relationCode")]
        public string RelationCode { get; set; }

        [JsonProperty("relationDescription")]
        public string RelationDescription { get; set; }
    }
    public class SkusLayoutModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("itemId")]
        public int ItemId { get; set; }

        [JsonProperty("templateCode")]
        public string TemplateCode { get; set; }

        [JsonProperty("layoutDescription")]
        public string LayoutDescription { get; set; }
    }
}
