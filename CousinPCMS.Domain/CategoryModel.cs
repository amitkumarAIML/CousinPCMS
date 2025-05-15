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
        public string akiLayoutTemplate { get; set; }
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
        public int additionalImagesCount { get; set; }
        public int urlLinksCount { get; set; }
    }

    public class AddCategoryModel
    {
        public string akiCategoryID { get; set; }
        public string akiCategoryParentID { get; set; }
        public string akiCategoryName { get; set; }
        public int akiCategoryGuidePrice { get; set; }
        public int akiCategoryGuideWeight { get; set; }
        public int akiCategoryListOrder { get; set; }
        public bool akiCategoryPopular { get; set; }
        public string akiCategoryImageURL { get; set; } = string.Empty;
        public int akiCategoryImageHeight { get; set; }
        public int akiCategoryImageWidth { get; set; }
        public bool akiCategoryIncludeInSearchByManufacture { get; set; }
        public int akiCategoryMinimumDigits { get; set; }
        public string akiCategoryReturnType { get; set; } = string.Empty;
        public bool akiCategoryShowPriceBreaks { get; set; }
        public string akiCategoryCommodityCode { get; set; } = string.Empty;
        public bool akiCategoryPromptUserIfPriceGroupIsBlank { get; set; }
        public string akiCategoryCountryOfOrigin { get; set; } = string.Empty;
        public bool akiCategoryTickBoxNotInUse { get; set; }
        public bool akiCategoryUseComplexSearch { get; set; }
        public int akiCategoryDiscount { get; set; }
        public bool akiCategoryLogInAndGreenTickOnly { get; set; }
        public string akiCategoryPrintCatImage { get; set; } = string.Empty;
        public bool akiCategoryPrintCatTemp { get; set; }
        public string akiCategoryAlternativeTitle { get; set; } = string.Empty;
        public string akiCategoryIndex1 { get; set; } = string.Empty;
        public string akiCategoryIndex2 { get; set; } = string.Empty;
        public string akiCategoryIndex3 { get; set; } = string.Empty;
        public string akiCategoryIndex4 { get; set; } = string.Empty;
        public string akiCategoryIndex5 { get; set; } = string.Empty;
        public int aki_Indentation { get; set; }
        public string akiDepartment { get; set; }
        public string akidepartmentname { get; set; }
        public bool aki_Show_Category_Text { get; set; }
        public bool aki_Show_Category_Image { get; set; }
        public string aki_Layout_Template { get; set; } = string.Empty;
        public string akiCategoryDescriptionText { get; set; } = string.Empty;
    }

    public class UpdateCategoryModel
    {
        public string akiCategoryID { get; set; }
        public string akiCategoryParentID { get; set; }
        public string akiCategoryName { get; set; }
        public int akiCategoryGuidePrice { get; set; }
        public int akiCategoryGuideWeight { get; set; }
        public int akiCategoryListOrder { get; set; }
        public bool akiCategoryPopular { get; set; }
        public string akiCategoryImageURL { get; set; } = string.Empty;
        public int akiCategoryImageHeight { get; set; }
        public int akiCategoryImageWidth { get; set; }
        public bool akiCategoryIncludeInSearchByManufacture { get; set; }
        public int akiCategoryMinimumDigits { get; set; }
        public string akiCategoryReturnType { get; set; } = string.Empty;
        public bool akiCategoryShowPriceBreaks { get; set; }
        public string akiCategoryCommodityCode { get; set; } = string.Empty;
        public bool akiCategoryPromptUserIfPriceGroupIsBlank { get; set; }
        public string akiCategoryCountryOfOrigin { get; set; } = string.Empty;
        public bool akiCategoryTickBoxNotInUse { get; set; }
        public bool akiCategoryUseComplexSearch { get; set; }
        public int akiCategoryDiscount { get; set; }
        public bool akiCategoryLogInAndGreenTickOnly { get; set; }
        public string akiCategoryPrintCatImage { get; set; } = string.Empty;
        public bool akiCategoryPrintCatTemp { get; set; }
        public string akiCategoryAlternativeTitle { get; set; } = string.Empty;
        public string akiCategoryIndex1 { get; set; } = string.Empty;
        public string akiCategoryIndex2 { get; set; } = string.Empty;
        public string akiCategoryIndex3 { get; set; } = string.Empty;
        public string akiCategoryIndex4 { get; set; } = string.Empty;
        public string akiCategoryIndex5 { get; set; } = string.Empty;
        public int aki_Indentation { get; set; }
        public string akiDepartment { get; set; }
        public string akidepartmentname { get; set; }
        public bool aki_Show_Category_Text { get; set; }
        public bool aki_Show_Category_Image { get; set; }
        public string aki_Layout_Template { get; set; } = string.Empty;
        public bool akiCategoryWebActive { get; set; }
        public string akiCategoryDescriptionText { get; set; } = string.Empty;
    }

    public class DeleteCategoryRequestModel
    {
        public string categoryID { get; set; }
    }

    public class CategoryLinkedURlModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int categoryurlID { get; set; }
        public string categoryID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
    }

    public class CategoryAdditionalImageModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public int catimageid { get; set; }
        public string categoryID { get; set; }
        public string imageURL { get; set; }
        public string imageName { get; set; }
        public int listorder { get; set; }
    }

    public class AddCategoryAdditionalImageRequestModel
    {
        public string categoryID { get; set; }
        public string imageURL { get; set; }
        public string imagename { get; set; }
        public int listorder { get; set; }
    }

    public class UpdateCategoryAdditionalImageRequestModel
    {
        public int catimageid { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }

    public class UpdateCategoryLinkUrlRequestModel
    {
        public int categoryurlID { get; set; }
        public int oldlistorder { get; set; }
        public int newlistorder { get; set; }
    }

    public class AddCategoryAdditionalLinkUrlRequestModel
    {
        public string categoryID { get; set; }
        public string linkURL { get; set; }
        public string linkText { get; set; }
        public string toolTip { get; set; }
        public string linkType { get; set; }
        public int listorder { get; set; }
    }

    public class DeleteCategoryURLRequestModel
    {
        public string categoryID { get; set; }
        public string linkURL { get; set; }
    }

    public class DeleteCategoryImageRequestModel
    {
        public string categoryID { get; set; }
        public string imageURL { get; set; }
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

    public class AddAdditionalProductforCategoryRequestModel
    {
        public int product { get; set; }
        public string prodCategory { get; set; }
        public int listorder { get; set; }
    }

    public class DeleteAssociatedProductCatRequestModel
    {
        public int product { get; set; }
        public string prodCategory { get; set; }
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

    public class DragDropCategoryModel
    {
        public string categoryid { get; set; }
        public string abovecategoryid { get; set; }
        public string belowcategoryid { get; set; }
        public string parentid { get; set; }
    }

}
