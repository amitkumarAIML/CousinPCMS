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

    public class UpdateProductModel
    {
        public int AkiProductID { get; set; }                        // Integer
        public string AkiCategoryID { get; set; }                    // Code[50]
        public string AkiProductName { get; set; }                   // Text[100]
        public string AkiProductHeading { get; set; }                // Text[250]
        public int AkiProductListOrder { get; set; }                 // Integer
        public bool AkiProductWebActive { get; set; }                // Boolean
        public string AkiProductCommodityCode { get; set; }          // Code[50]
        public string AkiProductCountryOfOrigin { get; set; }        // Text[50]
        public string AkiProductImageURL { get; set; }               // Text[250]
        public int AkiProductImageHeight { get; set; }               // Integer
        public int AkiProductImageWidth { get; set; }                // Integer
        public string AkiProductAlternativeTitle { get; set; }       // Text[2000]
        public string AKILayoutTemplate { get; set; }                // Text[250]
        public bool AkiProductShowPriceBreaks { get; set; }          // Boolean
        public bool AkiProductPrintLayoutTemp { get; set; }          // Boolean
        public string AkiProductIndexText1 { get; set; }             // Text[250]
        public string AkiProductIndexText2 { get; set; }             // Text[250]
        public string AkiProductIndexText3 { get; set; }             // Text[250]
        public string AkiProductIndexText4 { get; set; }             // Text[250]
        public string AkiProductIndexText5 { get; set; }             // Text[250]
        public string CategoryName { get; set; }                     // Text[250]
    }

    public class DeleteProductRequestModel
    {
        public int productID { get; set; }
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
