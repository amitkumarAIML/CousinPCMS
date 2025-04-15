using System.Text.Json.Serialization;

namespace CousinPCMS.Domain
{
    public class ItemCompetitorModel
    {
        [JsonPropertyName("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonPropertyName("akiItemId")]
        public string AkiItemId { get; set; }

        [JsonPropertyName("akiCompetitorID")]
        public string AkiCompetitorID { get; set; }

        [JsonPropertyName("akiCompetitorName")]
        public string AkiCompetitorName { get; set; }
    }
}
