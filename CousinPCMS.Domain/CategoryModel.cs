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

    public class UpdateCategoryModel
    {
        public string AkiCategoryID { get; set; }                      // Code[50]
        public string AkiCategoryParentID { get; set; }                // Code[50]
        public string AkiCategoryName { get; set; }                    // Text[100]
        public decimal AkiCategoryGuidePrice { get; set; }            // Decimal
        public int AkiCategoryGuideWeight { get; set; }               // Integer
        public int AkiCategoryListOrder { get; set; }                 // Integer
        public bool AkiCategoryPopular { get; set; }                  // Boolean
        public string AkiCategoryImageURL { get; set; }               // Text[250]
        public int AkiCategoryImageHeight { get; set; }               // Integer
        public int AkiCategoryImageWidth { get; set; }                // Integer
        public bool AkiCategoryIncludeInSearchByManufacture { get; set; } // Boolean
        public int AkiCategoryMinimumDigits { get; set; }             // Integer
        public string AkiCategoryReturnType { get; set; }             // Text[50]
        public bool AkiCategoryShowPriceBreaks { get; set; }          // Boolean
        public string AkiCategoryCommodityCode { get; set; }          // Text[50]
        public bool AkiCategoryPromptUserIfPriceGroupIsBlank { get; set; } // Boolean
        public string AkiCategoryCountryOfOrigin { get; set; }        // Code[50]
        public bool AkiCategoryTickBoxNotInUse { get; set; }          // Boolean
        public bool AkiCategoryUseComplexSearch { get; set; }         // Boolean
        public decimal AkiCategoryDiscount { get; set; }              // Decimal
        public bool AkiCategoryLogInAndGreenTickOnly { get; set; }    // Boolean
        public string AkiCategoryPrintCatImage { get; set; }          // Text[100]
        public bool AkiCategoryPrintCatTemp { get; set; }             // Boolean
        public string AkiCategoryAlternativeTitle { get; set; }       // Text[2000]
        public string AkiCategoryIndex1 { get; set; }                 // Text[250]
        public string AkiCategoryIndex2 { get; set; }                 // Text[250]
        public string AkiCategoryIndex3 { get; set; }                 // Text[250]
        public string AkiCategoryIndex4 { get; set; }                 // Text[250]
        public string AkiCategoryIndex5 { get; set; }                 // Text[250]
        public int AkiIndentation { get; set; }                       // Integer
        public string AkiDepartment { get; set; }                     // Text[250]
        public string AkiDepartmentName { get; set; }                 // Text[250]
        public bool AkiShowCategoryText { get; set; }                 // Boolean
        public bool AkiShowCategoryImage { get; set; }                // Boolean
        public string AkiLayoutTemplate { get; set; }                 // Text[250]
        public bool akiCategoryWebActive { get; set; }
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
        public bool isAdditionalProduct { get; set; }
    }

    public class CategoryListOrderModel
    {
        public int product { get; set; }
        public string additionalCategory { get; set; }
        public int listorder { get; set; }
    }

    public class UpdateListOrderModel
    {
        public int product { get; set; }
        public string prodCategory { get; set; }
        public int listorder { get; set; }
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

        public bool isAdditionalProduct { get; set; }
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
