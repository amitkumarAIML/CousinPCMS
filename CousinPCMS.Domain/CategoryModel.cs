using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace CousinPCMS.Domain
{
    public class CategoryModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public string akiCategoryID { get; set; }
        public string akiCategoryName { get; set; }
        public string akiCategoryParentID { get; set; }
        public string AKIDepartment { get; set; }
        public int akiCategoryGuidePrice { get; set; }
        public int akiCategoryGuideWeight { get; set; }
        public string akiCategoryCommodityCode { get; set; }
        public int akiCategoryListOrder { get; set; }
        public string akiCategoryCountryOfOrigin { get; set; }
        public bool akiCategoryPromptUserIfPriceGroupIsBlank { get; set; }
        public bool akiCategoryWebActive { get; set; }
        public bool akiCategoryPopular { get; set; }
        public bool akiCategoryTickBoxNotInUse { get; set; }
        public bool akiCategoryUseComplexSearch { get; set; }
        public string akiCategoryDescriptionText { get; set; }
        public string akiCategoryImageURL { get; set; }
        public int akiCategoryDiscount { get; set; }
        public int akiCategoryImageHeight { get; set; }
        public int akiCategoryImageWidth { get; set; }
        public bool akiCategoryIncludeInSearchByManufacture { get; set; }
        public bool akiCategoryLogInAndGreenTickOnly { get; set; }
        public int akiCategoryMinimumDigits { get; set; }
        public string akiCategoryReturnType { get; set; }
        public bool akiCategoryIsActive { get; set; }
        public bool AKI_Show_Category_Text { get; set; }
        public bool AKI_Show_Category_Image { get; set; }
        public string AKI_Layout_Template { get; set; }
        public string akiCategoryAlternativeTitle { get; set; }
        public bool akiCategoryShowPriceBreaks { get; set; }
        public string akiCategoryIndex1 { get; set; }
        public string akiCategoryIndex2 { get; set; }
        public string akiCategoryIndex3 { get; set; }
        public string akiCategoryIndex4 { get; set; }
        public string akiCategoryIndex5 { get; set; }
        public string akiCategoryPrintCatText { get; set; }
        public string akiCategoryPrintCatImage { get; set; }
        public bool akiCategoryPrintCatTemp { get; set; }
        public int AKI_Indentation { get; set; }
        public string AKIdepartmentname { get; set; }
    }

    public class AddCategoryRequestModel
    {
        public string akiCategoryID { get; set; }
        public string akiCategoryName { get; set; }
        public string akiCategoryParentID { get; set; }
        public string AKIDepartment { get; set; }
        public int akiCategoryGuidePrice { get; set; }
        public int akiCategoryGuideWeight { get; set; }
        public string akiCategoryCommodityCode { get; set; }
        public int akiCategoryListOrder { get; set; }
        public string akiCategoryCountryOfOrigin { get; set; }
        public bool akiCategoryPromptUserIfPriceGroupIsBlank { get; set; }
        public bool akiCategoryWebActive { get; set; }
        public bool akiCategoryPopular { get; set; }
        public bool akiCategoryTickBoxNotInUse { get; set; }
        public bool akiCategoryUseComplexSearch { get; set; }
        public string akiCategoryDescriptionText { get; set; }
        public string akiCategoryImageURL { get; set; }
        public int akiCategoryDiscount { get; set; }
        public int akiCategoryImageHeight { get; set; }
        public int akiCategoryImageWidth { get; set; }
        public bool akiCategoryIncludeInSearchByManufacture { get; set; }
        public bool akiCategoryLogInAndGreenTickOnly { get; set; }
        public int akiCategoryMinimumDigits { get; set; }
        public string akiCategoryReturnType { get; set; }
        public bool akiCategoryIsActive { get; set; }
        public bool AKI_Show_Category_Text { get; set; }
        public bool AKI_Show_Category_Image { get; set; }
        public string AKI_Layout_Template { get; set; }
        public string akiCategoryAlternativeTitle { get; set; }
        public bool akiCategoryShowPriceBreaks { get; set; }
        public string akiCategoryIndex1 { get; set; }
        public string akiCategoryIndex2 { get; set; }
        public string akiCategoryIndex3 { get; set; }
        public string akiCategoryIndex4 { get; set; }
        public string akiCategoryIndex5 { get; set; }
        public string akiCategoryPrintCatText { get; set; }
        public string akiCategoryPrintCatImage { get; set; }
        public bool akiCategoryPrintCatTemp { get; set; }
        public int AKI_Indentation { get; set; }
        public string AKIdepartmentname { get; set; }
    }

    public class DeleteCategoryRequestModel
    {
        public string categoryID { get; set; }
    }

    public class AssociatedProductRequestModel
    {
        public int Product { get; set; }
        public string additionalCategory { get; set; }
        public int Listorder { get; set; }
    }

    public class LinkedAttributeModel
    {
        [JsonPropertyName("@odata.etag")]
        public string ODataEtag { get; set; }

        public string AkiItemNo { get; set; }
        public string AkiAttributeName { get; set; }
        public string AkiAttributeValue { get; set; }
        public bool AkiLink { get; set; }
        public string AkiStage2User { get; set; }
        public string AkiStage3User { get; set; }
    }

    public class AdditionalCategoryModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("Product")]
        public int Product { get; set; }

        [JsonProperty("additionalCategory")]
        public string AdditionalCategory { get; set; }

        [JsonProperty("Listorder")]
        public int ListOrder { get; set; }

        [JsonProperty("ProductName")]
        public string ProductName { get; set; }

        [JsonProperty("webactive")]
        public bool WebActive { get; set; }

        [JsonProperty("CategoryName")]
        public string CategoryName { get; set; }
    }

    public class CategoryLayoutModel
    {
        [JsonProperty("@odata.etag")]
        public string ODataEtag { get; set; }

        [JsonProperty("categoryId")]
        public int CategoryId { get; set; }

        [JsonProperty("templateCode")]
        public string TemplateCode { get; set; }

        [JsonProperty("layoutDescription")]
        public string LayoutDescription { get; set; }
    }
}
