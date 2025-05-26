using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class SkusModel
    {
    }

    public class AttributeFilterRequest
    {
        public List<string> attributeNames { get; set; }
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
        public bool ItemObsolte { get; set; }

        [JsonProperty("itemIsUnavailable")]
        public bool ItemIsUnavailable { get; set; }

        [JsonProperty("isrelatedSKU")]
        public bool IsrelatedSKU { get; set; }

        public int skuID { get; set; }
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
        public int akiGuidePriceTBC { get; set; }
        public int akiGuideWeightTBC { get; set; }
        public bool akicurrentlyPartRestricted { get; set; }
        public string akiCountryofOrigin { get; set; }
        public bool akiPrintLayoutTemp { get; set; }
        public string akiAlternativeTitle { get; set; }
        public string akiCompetitors { get; set; }
        public bool akiPriceBreaks { get; set; }
        public int akiItemShippingWeight { get; set; }
        public int akiItemPriceSiteSellPrice { get; set; }
        public string akiTemplateID { get; set; }
        public string akiSKUDescription { get; set; }
        public string akiPricingFormula { get; set; }
        public string akiPriceBreak { get; set; }
        public string akiPriceGroup { get; set; }
        public bool akiSKUIsActive { get; set; }
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
        public int skuitemURLid { get; set; }
        public string skuitemID { get; set; }
        public string linkText { get; set; }
        public string linkURL { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
    }

    public class SkusAdditionalImageModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int skuImageID { get; set; }

        [JsonProperty("skuitemID")]
        public string skuItemID { get; set; }

        public string imageName { get; set; }
        public string imageURL { get; set; }
        public int listorder { get; set; }
    }

    public class AddSkuAdditionalImageRequestModel
    {
        public string skuItemID { get; set; }
        public string imageURL { get; set; }
        public string imagename { get; set; }
        public int listorder { get; set; }
    }

    public class UpdateSkuAdditionalImageRequestModel
    {
        public int skuImageID { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }

    public class UpdateSkuLinkUrlRequestModel
    {
        public int skuitemURLID { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }

    public class AddSkuAdditionalLinkUrlRequestModel
    {
        public string skuItemID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
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

    public class SkuAttributesModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int linkedId { get; set; }
        public string akiItemNo { get; set; }
        public string akiAttributeName { get; set; }
        public string akiAttributeValue { get; set; }
        public bool akiLink { get; set; }
    }

    public class AddSKULinkedAttributeRequestModel
    {
        public string akiItemNo { get; set; }
        public string akiAttributeName { get; set; }
        public string akiAttributeValue { get; set; }
        public bool akiLink { get; set; }
    }

    public class UpdateSKULinkedAttributeRequestModel
    {
        public int linkedid { get; set; }
        public string akiItemNo { get; set; }
        public string akiAttributeName { get; set; }
        public string akiAttributeValue { get; set; }
        public bool akiLink { get; set; }
    }

    public class UpdateSKUObsoleteRequestModel
    {
        public string akiitemid { get; set; }
        public bool akiObsolete { get; set; }
    }

    public class UpdateSKUUnavailableRequestModel
    {
        public string akiitemid { get; set; }
        public bool akiCurrentlyPartRestricted { get; set; }
    }

    public class DragDropSkuRequestModel
    {
        public string akiitemid { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
        public string categoryid { get; set; }
        public int productid { get; set; }
    }

}
