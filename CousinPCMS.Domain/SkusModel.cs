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

        [JsonProperty("relatedSKUName")]
        public string RelatedSKUName { get; set; }

        [JsonProperty("itemManufactureRef")]
        public string ItemManufactureRef { get; set; }

        [JsonProperty("itemObsolte")]
        public string ItemObsolte { get; set; }

        [JsonProperty("itemIsUnavailable")]
        public string ItemIsUnavailable { get; set; }

        [JsonProperty("isrelatedSKU")]
        public string IsrelatedSKU { get; set; }
    }

    public class DeleteSkusRequestModel
    {
        public string itemno { get; set; }
    }

    public class UpdateItemRelatedSkuModel
    {
        public string itemNo { get; set; }
        public string relatedItemNo { get; set; }
        public bool isrelatedSKU { get; set; }
    }

    public class UpdateSkuItemRequestModel
    {
        public string akiitemid { get; set; }
        public string akiProductID { get; set; }
        public string akiCategoryID { get; set; }
        public string akiManufacturerRef { get; set; }
        public int akiListOrder { get; set; }
        public bool akiObsolete { get; set; }
        public bool akiWebActive { get; set; }
        public string akiImageURL { get; set; }
        public string akiCommodityCode { get; set; }
        public int akiGuidePrice { get; set; }
        public int akiGuideWeight { get; set; }
        public bool akicurrentlyPartRestricted { get; set; }
        public string akiCountryofOrigin { get; set; }
        public bool akiPrintLayoutTemp { get; set; }
        public string akiAlternativeTitle { get; set; }
        public string akiCompetitors { get; set; }
        public bool akiPricebreaks { get; set; }
        public int akiItemShippingWeight { get; set; }
        public string akiItemSiteID { get; set; }
        public int akiItemPriceSiteSellPrice { get; set; }
        public string akiItemShortDescription { get; set; }
        public int akiTemplateID { get; set; }
        public string akiAltSKUName { get; set; }
        public string akiLayoutTemplate { get; set; }
        public string akiSKUDescription { get; set; }
        public string akiPricingFormula { get; set; }
        public string akiPriceBreak { get; set; }
        public string akiPriceGroup { get; set; }
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

    public class SkusLinkedURlModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        [JsonProperty("skuitemID")]
        public string skuItemID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
    }

    public class SkusAdditionalImageModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        [JsonProperty("skuitemID")]
        public string skuItemID { get; set; }
        public string imageURL { get; set; }
        public string imageName { get; set; }
    }

    public class AddSkuAdditionalImageRequestModel
    {
        public string skuItemID { get; set; }
        public string imageURL { get; set; }
        public string imagename { get; set; }
    }

    public class AddSkuAdditionalLinkUrlRequestModel
    {
        public string skuItemID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
    }

    public class DeleteSkuURLRequestModel
    {
        public string skuItemID { get; set; }
        public string linkURL { get; set; }
    }

    public class DeleteSkuImageRequestModel
    {
        public string skuItemID { get; set; }
        public string imageURL { get; set; }
    }
}
