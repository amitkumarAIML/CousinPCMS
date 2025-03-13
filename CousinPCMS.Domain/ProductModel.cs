using System.Text.Json.Serialization;

namespace CousinPCMS.Domain
{
    public class ProductModel
    {
        [JsonPropertyName("@odata.etag")]
        public string ODataEtag { get; set; }

        public int AkiProductID { get; set; }
        public string AkiCategoryID { get; set; }
        public string AkiProductName { get; set; }
        public string AkiProductDescription { get; set; }
        public int AkiProductListOrder { get; set; }
        public bool AkiProductWebActive { get; set; }
        public string AkiProductCommodityCode { get; set; }
        public string AkiProductImageURL { get; set; }
        public int AkiProductImageHeight { get; set; }
        public int AkiProductImageWidth { get; set; }
        public bool AkiProductPrintCatActive { get; set; }
        public string AkiProductPrintTitle { get; set; }
        public bool AkiProductShowPriceBreaks { get; set; }
        public string AkiProductHeading { get; set; }
        public string AkiProductText { get; set; }
        public string AkiProductCountryOfOrigin { get; set; }
        public bool AkiProductPrintLayoutTemp { get; set; }
        public string AkiProductIndexText1 { get; set; }
        public string AkiProductIndexText2 { get; set; }
        public string AkiProductIndexText3 { get; set; }
        public string AkiProductIndexText4 { get; set; }
        public string AkiProductIndexText5 { get; set; }
        public string Category_Name { get; set; }
    }
}
