using Newtonsoft.Json;

namespace CousinPCMS.Domain
{
    public class ItemMappingResponseModel
    {
        [JsonProperty("@odata.etag")]
        public string odataetag { get; set; }
        public string itemNo { get; set; }
        public string categorytId { get; set; }
        public int productid { get; set; }
        public string itemdesc { get; set; }
        public string mfrref { get; set; }
        public int listorder { get; set; }
        public bool obsolete { get; set; }
        public bool unavailable { get; set; }
        public bool webactive { get; set; }
        public bool catactive { get; set; }
        public string tempid { get; set; }
        public string AltSkuName { get; set; }
        public string cou { get; set; }
        public string commCode { get; set; }
        public int skuITEMID { get; set; }
    }

    public class ItemResponseModel
    {
        [JsonProperty("@odata.etag")]
        public string? odataetag { get; set; } = null;
        public string? akiitemid { get; set; } = null;
        public string? skuName { get; set; } = null;
        public int priceUnitConversion { get; set; } = 0;
        public string? inventoryPostingGroup { get; set; } = null;
        public string? shelfNo { get; set; } = null;
        public string? itemDiscGroup { get; set; } = null;
        public bool allowInvoiceDisc { get; set; } = false;
        public int statisticsGroup { get; set; } = 0;
        public int commissionGroup { get; set; } = 0;
        public int unitPrice { get; set; } = 0;
        public string? priceProfitCalculation { get; set; } = null;
        public int profit { get; set; } = 0;
        public int unitCost { get; set; } = 0;
        public int standardCost { get; set; } = 0;
        public int lastDirectCost { get; set; } = 0;
        public int indirectCost { get; set; } = 0;
        public bool costIsAdjusted { get; set; } = false;
        public bool allowOnlineAdjustment { get; set; } = false;
        public string? leadTimeCalculation { get; set; } = null;
        public int reorderPoint { get; set; } = 0;
        public int maximumInventory { get; set; } = 0;
        public int reorderQuantity { get; set; } = 0;
        public string? alternativeItemNo { get; set; } = null;
        public int unitListPrice { get; set; } = 0;
        public int dutyDue { get; set; } = 0;
        public string? dutyCode { get; set; } = null;
        public int grossWeight { get; set; } = 0;
        public int netWeight { get; set; } = 0;
        public int unitsPerParcel { get; set; } = 0;
        public int unitVolume { get; set; } = 0;
        public string? durability { get; set; } = null;
        public string? freightType { get; set; } = null;
        public string? tariffNo { get; set; } = null;
        public int dutyUnitConversion { get; set; } = 0;
        public string? countryRegionPurchasedCode { get; set; } = null;
        public int budgetQuantity { get; set; } = 0;
        public int budgetedAmount { get; set; } = 0;
        public int budgetProfit { get; set; } = 0;
        public bool blocked { get; set; } = false;
        public string? blockReason { get; set; } = null;
        public DateTime lastDateTimeModified { get; set; } = default; // default for DateTime is DateTime.MinValue
        public string? lastDateModified { get; set; } = null;
        public string? lastTimeModified { get; set; } = null;
        public bool priceIncludesVAT { get; set; } = false;
        public string? vatBusPostingGrPrice { get; set; } = null;
        public string? genProdPostingGroup { get; set; } = null;
        public string? picture { get; set; } = null; // Assuming picture is a URL or Base64 string
        public bool automaticExtTexts { get; set; } = false;
        public string? noSeries { get; set; } = null;
        public string? taxGroupCode { get; set; } = null;
        public string? vatProdPostingGroup { get; set; } = null;
        public string? reserve { get; set; } = null;
        public string? globalDimension1Code { get; set; } = null;
        public string? globalDimension2Code { get; set; } = null;
        public string? stockoutWarning { get; set; } = null;
        public string? preventNegativeInventory { get; set; } = null;
        public string? variantMandatoryIfExists { get; set; } = null;
        public string? applicationWkshUserID { get; set; } = null;
        public bool coupledToCRM { get; set; } = false;
        public string? gtin { get; set; } = null;
        public string? defaultDeferralTemplateCode { get; set; } = null;
        public int lowLevelCode { get; set; } = 0;
        public int lotSize { get; set; } = 0;
        public string? serialNos { get; set; } = null;
        public string? lastUnitCostCalcDate { get; set; } = null;
        public int rolledUpMaterialCost { get; set; } = 0;
        public int rolledUpCapacityCost { get; set; } = 0;
        public int scrap { get; set; } = 0;
        public bool inventoryValueZero { get; set; } = false;
        public int discreteOrderQuantity { get; set; } = 0;
        public int minimumOrderQuantity { get; set; } = 0;
        public int maximumOrderQuantity { get; set; } = 0;
        public int safetyStockQuantity { get; set; } = 0;
        public int orderMultiple { get; set; } = 0;
        public string? safetyLeadTime { get; set; } = null;
        public string? flushingMethod { get; set; } = null;
        public string? replenishmentSystem { get; set; } = null;
        public int roundingPrecision { get; set; } = 0;
        public string? purchUnitOfMeasure { get; set; } = null;
        public string? timeBucket { get; set; } = null;
        public string? reorderingPolicy { get; set; } = null;
        public bool includeInventory { get; set; } = false;
        public string? manufacturingPolicy { get; set; } = null;
        public string? reschedulingPeriod { get; set; } = null;
        public string? lotAccumulationPeriod { get; set; } = null;
        public string? dampenerPeriod { get; set; } = null;
        public int dampenerQuantity { get; set; } = 0;
        public int overflowLevel { get; set; } = 0;
        public string? manufacturerCode { get; set; } = null;
        public bool createdFromNonstockItem { get; set; } = false;
        public string? purchasingCode { get; set; } = null;
        public bool excludedFromCostAdjustment { get; set; } = false;
        public string? serviceItemGroup { get; set; } = null;
        public string? itemTrackingCode { get; set; } = null;
        public string? lotNos { get; set; } = null;
        public string? expirationCalculation { get; set; } = null;
        public string? warehouseClassCode { get; set; } = null;
        public string? specialEquipmentCode { get; set; } = null;
        public string? putAwayTemplateCode { get; set; } = null;
        public string? putAwayUnitOfMeasureCode { get; set; } = null;
        public string? physInvtCountingPeriodCode { get; set; } = null;
        public string? lastCountingPeriodUpdate { get; set; } = null;
        public bool useCrossDocking { get; set; } = false;
        public string? nextCountingStartDate { get; set; } = null;
        public string? nextCountingEndDate { get; set; } = null;
        public string? unitOfMeasureId { get; set; } = null;
        public string? taxGroupId { get; set; } = null;
        public bool salesBlocked { get; set; } = false;
        public bool purchasingBlocked { get; set; } = false;
        public string? itemCategoryId { get; set; } = null;
        public string? inventoryPostingGroupId { get; set; } = null;
        public string? genProdPostingGroupId { get; set; } = null;
        public bool serviceBlocked { get; set; } = false;
        public string? overReceiptCode { get; set; } = null;
        public string? assemblyPolicy { get; set; } = null;
        public string? routingNo { get; set; } = null;
        public string? productionBOMNo { get; set; } = null;
        public int singleLevelMaterialCost { get; set; } = 0;
        public int singleLevelCapacityCost { get; set; } = 0;
        public int singleLevelSubcontrdCost { get; set; } = 0;
        public int singleLevelCapOvhdCost { get; set; } = 0;
        public int singleLevelMfgOvhdCost { get; set; } = 0;
        public int overheadRate { get; set; } = 0;
        public int rolledUpSubcontractedCost { get; set; } = 0;
        public int rolledUpMfgOvhdCost { get; set; } = 0;
        public int rolledUpCapOverheadCost { get; set; } = 0;
        public bool critical { get; set; } = false;
        public string? commonItemNo { get; set; } = null;
        public string? no2 { get; set; } = null;
        public string? searchDescription { get; set; } = null;
        public string? description2 { get; set; } = null;
        public int akiSKUID { get; set; } = 0;
        public string? akiProductID { get; set; } = null;
        public string? akiCategoryID { get; set; } = null;
        public string? akiSKUDescription { get; set; } = null;
        public string? akiManufacturerRef { get; set; } = null;
        public string? akigpItemNumber { get; set; } = null;
        public int additionalImagesCount { get; set; } = 0;
        public int urlLinksCount { get; set; } = 0;
        public int akiListOrder { get; set; } = 0;
        public bool akiObsolete { get; set; } = false;
        public bool akiWebActive { get; set; } = false;
        public string? akiImageURL { get; set; } = null;
        public string? akiCommodityCode { get; set; } = null;
        public int akiGuidePriceTBC { get; set; } = 0;
        public int akiGuideWeightTBC { get; set; } = 0;
        public bool akiSKUIsActive { get; set; } = false;
        public bool akiCurrentlyPartRestricted { get; set; } = false;
        public string? akiCountryofOrigin { get; set; } = null;
        public bool akiPrintLayoutTemp { get; set; } = false;
        public string? akiAlternativeTitle { get; set; } = null;
        public string? akiCompetitors { get; set; } = null;
        public bool akiPriceBreaksTBC { get; set; } = false;
        public string? itemclasscode { get; set; } = null;
        public int akiItemShippingWeight { get; set; } = 0;
        public string? itemUOfMeasureScheduleID { get; set; } = null;
        public string? itemsellingUOfM { get; set; } = null;
        public string? itemsupplierID { get; set; } = null;
        public string? itemcreditoritemno { get; set; } = null;
        public string? akiItemSiteID { get; set; } = null;
        public int akiItemPriceWebsiteSellPrice { get; set; } = 0;
        public int itemstartingquantity { get; set; } = 0;
        public string? itemtype { get; set; } = null;
        public string? itemvaluationMethod { get; set; } = null;
        public int akiItemPriceSiteSellPrice { get; set; } = 0;
        public string? akiItemShortDescription { get; set; } = null;
        public string? akiTemplateID { get; set; } = null;
        public string? akiAltSKUName { get; set; } = null;
        public string? akiLayoutTemplate { get; set; } = null;
        public string? akiPricingFormula { get; set; } = null;
        public string? akiPriceBreak { get; set; } = null;
        public string? akiPriceGroup { get; set; } = null;
    }

    public class AddItemRequestModel
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
        public bool akiPriceBreaksTBC { get; set; }
        public int akiItemShippingWeight { get; set; }
        public int akiItemPriceSiteSellPrice { get; set; }
        public string akiTemplateID { get; set; }
        public string akiSKUDescription { get; set; }
        public string akiPricingFormula { get; set; }
        public string akiPriceBreak { get; set; }
        public string akiPriceGroup { get; set; }
        public string skuName { get; set; }
        public bool akiSKUIsActive { get; set; }
        public string akigpItemNumber { get; set; }
    }

}
