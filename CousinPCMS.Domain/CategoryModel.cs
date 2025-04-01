using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace CousinPCMS.Domain
{
    public class CategoryModel
    {
        [JsonPropertyName("@odata.etag")]
        public string ODataEtag { get; set; }
        public string AkiCategoryID { get; set; }
        public string AkiCategoryName { get; set; }
        public string AkiCategoryParentID { get; set; }
        public decimal AkiCategoryGuidePrice { get; set; }
        public decimal AkiCategoryGuideWeight { get; set; }
        public int AkiCategoryListOrder { get; set; }
        public bool AkiCategoryWebActive { get; set; }
        public bool AkiCategoryPopular { get; set; }
        public string AkiCategoryDescriptionText { get; set; }
        public string AkiCategoryImageURL { get; set; }
        public int AkiCategoryImageHeight { get; set; }
        public int AkiCategoryImageWidth { get; set; }
        public bool AkiCategoryIncludeInSearchByManufacture { get; set; }
        public int AkiCategoryMinimumDigits { get; set; }
        public string AkiCategoryReturnType { get; set; }
        public bool AkiCategoryShowPriceBreaks { get; set; }
        public string AkiCategoryCommodityCode { get; set; }
        public bool AkiCategoryPromptUserIfPriceGroupIsBlank { get; set; }
        public string AkiCategoryCountryOfOrigin { get; set; }
        public bool AkiCategoryTickBoxNotInUse { get; set; }
        public bool AkiCategoryUseComplexSearch { get; set; }
        public decimal AkiCategoryDiscount { get; set; }
        public bool AkiCategoryLogInAndGreenTickOnly { get; set; }
        public bool AkiCategoryPrintCatActive { get; set; }
        public string AkiCategoryPrintCatText { get; set; }
        public string AkiCategoryPrintCatImage { get; set; }
        public bool AkiCategoryPrintCatTemp { get; set; }
        public string AkiCategoryPrintCatTitle { get; set; }
        public string AkiCategoryIndex1 { get; set; }
        public string AkiCategoryIndex2 { get; set; }
        public string AkiCategoryIndex3 { get; set; }
        public string AkiCategoryIndex4 { get; set; }
        public string AkiCategoryIndex5 { get; set; }
        public int AKI_Indentation { get; set; }
        public string AKIDepartment { get; set; }
        public string AKIDepartmentName { get; set; }
        public string akiCategoryAlternativeTitle { get; set; }
        public string AKI_Layout_Template { get; set; }
        public string AKI_Show_Category_Text { get; set; }
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
}
