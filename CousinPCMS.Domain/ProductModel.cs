using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class ProductModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int akiProductID { get; set; }
        public string akiCategoryID { get; set; }
        public string akiProductName { get; set; }
        public string akiProductDescription { get; set; }
        public string akiProductHeading { get; set; }
        public string akiProductText { get; set; }
        public int akiProductListOrder { get; set; }
        public bool akiProductWebActive { get; set; }
        public string akiProductCommodityCode { get; set; }
        public string akiProductCountryOfOrigin { get; set; }
        public string akiProductImageURL { get; set; }
        public int akiProductImageHeight { get; set; }
        public int akiProductImageWidth { get; set; }
        public bool akiProductIsActive { get; set; }
        public string akiProductAlternativeTitle { get; set; }
        public string AKI_Layout_Template { get; set; }
        public bool akiProductShowPriceBreaks { get; set; }
        public bool akiProductPrintLayoutTemp { get; set; }
        public string akiProductIndexText1 { get; set; }
        public string akiProductIndexText2 { get; set; }
        public string akiProductIndexText3 { get; set; }
        public string akiProductIndexText4 { get; set; }
        public string akiProductIndexText5 { get; set; }
        public string Category_Name { get; set; }
    }

    public class AddProductModel
    {
        public int akiProductID { get; set; }
        public string akiCategoryID { get; set; }
        public string akiProductName { get; set; }
        public string akiProductDescription { get; set; }
        public string akiProductHeading { get; set; }
        public string akiProductText { get; set; }
        public int akiProductListOrder { get; set; }
        public bool akiProductWebActive { get; set; }
        public string akiProductCommodityCode { get; set; }
        public string akiProductCountryOfOrigin { get; set; }
        public string akiProductImageURL { get; set; }
        public int akiProductImageHeight { get; set; }
        public int akiProductImageWidth { get; set; }
        public string akiProductAlternativeTitle { get; set; }
        public string AKI_Layout_Template { get; set; }
        public bool akiProductShowPriceBreaks { get; set; }
        public bool akiProductPrintLayoutTemp { get; set; }
        public string akiProductIndexText1 { get; set; }
        public string akiProductIndexText2 { get; set; }
        public string akiProductIndexText3 { get; set; }
        public string akiProductIndexText4 { get; set; }
        public string akiProductIndexText5 { get; set; }
        public string Category_Name { get; set; }
    }

    public class DeleteProductRequestModel
    {
        public int producttID { get; set; }
    }
    public class ProductLayoutModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("productId")]
        public int ProductId { get; set; }

        [JsonProperty("templateCode")]
        public string TemplateCode { get; set; }

        [JsonProperty("layoutDescription")]
        public string LayoutDescription { get; set; }
    }
}
