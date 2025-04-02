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

    public class SkusRelationTypeModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("relationCode")]
        public string RelationCode { get; set; }

        [JsonProperty("relationDescription")]
        public string RelationDescription { get; set; }
    }
}
