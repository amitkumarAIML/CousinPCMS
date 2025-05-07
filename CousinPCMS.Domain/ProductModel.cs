using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class ProductCountModel
    {
        [JsonProperty("@odata.count")]
        public int Count { get; set; }

        [JsonProperty("value")]
        public List<object> Value { get; set; } // Placeholder list, since it's empty
    }

    public class ProductResponseModel
    {
        public int TotalRecords { get; set; }
        public List<ProductModel> Products { get; set; }
    }

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
        public string aki_Layout_Template { get; set; }
        public bool akiProductShowPriceBreaks { get; set; }
        public bool akiProductPrintLayoutTemp { get; set; }
        public string akiProductIndexText1 { get; set; }
        public string akiProductIndexText2 { get; set; }
        public string akiProductIndexText3 { get; set; }
        public string akiProductIndexText4 { get; set; }
        public string akiProductIndexText5 { get; set; }
        public string category_Name { get; set; }
    }

    public class ProductLinkedURlModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int producturlID { get; set; }
        public int productID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
    }

    public class AdditionalProductModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }
        public int product { get; set; }
        public int additionalProduct { get; set; }
        public int listOrder { get; set; }
        public string productName { get; set; }
        public bool webActive { get; set; }
        public string additionalProductName { get; set; }
    }

    public class ProductAdditionalImageModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int productImageID { get; set; }
        public int productID { get; set; }
        public string imageURL { get; set; }
        public string imageName { get; set; }
        public int listorder { get; set; }
    }

    public class AdditionalProductRequestModel
    {
        public int product { get; set; }
        public string addproduct { get; set; }
        public int listorder { get; set; }
    }

    public class AddProductAdditionalImageRequestModel
    {
        public int productID { get; set; }
        public string imageURL { get; set; }
        public string imagename { get; set; }
        public int listorder { get; set; }
    }

    public class UpdateProductAdditionalImageRequestModel
    {
        public int productimageid { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }

    public class UpdateProductUrlsRequestModel
    {
        public int producturlID { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }


    public class AddProductAdditionalLinkUrlRequestModel
    {
        public int productID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
    }

    public class DeleteProductURLRequestModel
    {
        public int productID { get; set; }
        public string linkURL { get; set; }
    }

    public class DeleteAssociatedProductRequestModel
    {
        public int product { get; set; }
        public string addproduct { get; set; }
    }


    public class DeleteProductImageRequestModel
    {
        public int productID { get; set; }
        public string imageURL { get; set; }
    }

    public class AddProductRequestModel
    {
        public int akiProductID { get; set; }
        public string akiCategoryID { get; set; }
        public string akiProductName { get; set; }
        public string akiProductHeading { get; set; } = string.Empty;
        public int akiProductListOrder { get; set; }
        public string akiProductCommodityCode { get; set; } = string.Empty;
        public string akiProductCountryOfOrigin { get; set; } = string.Empty;
        public string akiProductImageURL { get; set; } = string.Empty;
        public int akiProductImageHeight { get; set; }
        public int akiProductImageWidth { get; set; }
        public string akiProductAlternativeTitle { get; set; } = string.Empty;
        public string aki_Layout_Template { get; set; } = string.Empty;
        public bool akiProductShowPriceBreaks { get; set; }
        public bool akiProductPrintLayoutTemp { get; set; }
        public string? akiProductIndexText1 { get; set; } = string.Empty;
        public string akiProductIndexText2 { get; set; } = string.Empty;
        public string akiProductIndexText3 { get; set; } = string.Empty;
        public string akiProductIndexText4 { get; set; } = string.Empty;
        public string akiProductIndexText5 { get; set; } = string.Empty;
        public string categoryName { get; set; }
        public string akiProductDescription { get; set; } = string.Empty;
        public string akiProductText { get; set; } = string.Empty;
    }

    public class UpdateProductModel
    {
        public int akiProductID { get; set; }
        public string akiCategoryID { get; set; }
        public string akiProductName { get; set; }
        public string akiProductHeading { get; set; } = string.Empty;
        public int akiProductListOrder { get; set; }
        public bool akiProductWebActive { get; set; }
        public string akiProductCommodityCode { get; set; } = string.Empty;
        public string akiProductCountryOfOrigin { get; set; } = string.Empty;
        public string akiProductImageURL { get; set; } = string.Empty;
        public int akiProductImageHeight { get; set; }
        public int akiProductImageWidth { get; set; }
        public string akiProductAlternativeTitle { get; set; } = string.Empty;
        public string aki_Layout_Template { get; set; } = string.Empty;
        public bool akiProductShowPriceBreaks { get; set; }
        public bool akiProductPrintLayoutTemp { get; set; }
        public string akiProductIndexText1 { get; set; } = string.Empty;
        public string akiProductIndexText2 { get; set; } = string.Empty;
        public string akiProductIndexText3 { get; set; } = string.Empty;
        public string akiProductIndexText4 { get; set; } = string.Empty;
        public string akiProductIndexText5 { get; set; } = string.Empty;
        public string categoryName { get; set; }
        public string akiProductDescription { get; set; } = string.Empty;
        public string akiProductText { get; set; } = string.Empty;
        public bool iscommoditychange { get; set; }
        public bool iscountrychange { get; set; }
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
