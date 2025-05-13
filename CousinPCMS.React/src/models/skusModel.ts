export interface SKuList {
  odataetag: string;
  akiitemid: string;
  skuName: string;
  priceUnitConversion: number;
  inventoryPostingGroup: string;
  shelfNo: string;
  itemDiscGroup: string;
  allowInvoiceDisc: boolean;
  statisticsGroup: number;
  commissionGroup: number;
  unitPrice: number;
  priceProfitCalculation: string;
  profit: number;
  unitCost: number;
  standardCost: number;
  lastDirectCost: number;
  indirectCost: number;
  costIsAdjusted: boolean;
  allowOnlineAdjustment: boolean;
  leadTimeCalculation: string;
  reorderPoint: number;
  maximumInventory: number;
  reorderQuantity: number;
  alternativeItemNo: string;
  unitListPrice: number;
  dutyDue: number;
  dutyCode: string;
  grossWeight: number;
  netWeight: number;
  unitsPerParcel: number;
  unitVolume: number;
  durability: string;
  freightType: string;
  tariffNo: string;
  dutyUnitConversion: number;
  countryRegionPurchasedCode: string;
  budgetQuantity: number;
  budgetedAmount: number;
  budgetProfit: number;
  blocked: boolean;
  blockReason: string;
  lastDateTimeModified: string;
  lastDateModified: string;
  lastTimeModified: string;
  priceIncludesVAT: boolean;
  vatBusPostingGrPrice: string;
  genProdPostingGroup: string;
  picture: string;
  countryRegionOfOriginCode: string;
  automaticExtTexts: boolean;
  noSeries: string;
  taxGroupCode: string;
  vatProdPostingGroup: string;
  reserve: string;
  globalDimension1Code: string;
  globalDimension2Code: string;
  stockoutWarning: string;
  preventNegativeInventory: string;
  variantMandatoryIfExists: string;
  applicationWkshUserID: string;
  coupledToCRM: boolean;
  gtin: string;
  defaultDeferralTemplateCode: string;
  lowLevelCode: number;
  lotSize: number;
  serialNos: string;
  lastUnitCostCalcDate: string;
  rolledUpMaterialCost: number;
  rolledUpCapacityCost: number;
  scrap: number;
  inventoryValueZero: boolean;
  discreteOrderQuantity: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  safetyStockQuantity: number;
  orderMultiple: number;
  safetyLeadTime: string;
  flushingMethod: string;
  replenishmentSystem: string;
  roundingPrecision: number;
  purchUnitOfMeasure: string;
  timeBucket: string;
  reorderingPolicy: string;
  includeInventory: boolean;
  manufacturingPolicy: string;
  reschedulingPeriod: string;
  lotAccumulationPeriod: string;
  dampenerPeriod: string;
  dampenerQuantity: number;
  overflowLevel: number;
  manufacturerCode: string;
  createdFromNonstockItem: boolean;
  purchasingCode: string;
  excludedFromCostAdjustment: boolean;
  serviceItemGroup: string;
  itemTrackingCode: string;
  lotNos: string;
  expirationCalculation: string;
  warehouseClassCode: string;
  specialEquipmentCode: string;
  putAwayTemplateCode: string;
  putAwayUnitOfMeasureCode: string;
  physInvtCountingPeriodCode: string;
  lastCountingPeriodUpdate: string;
  useCrossDocking: boolean;
  nextCountingStartDate: string;
  nextCountingEndDate: string;
  unitOfMeasureId: string;
  taxGroupId: string;
  salesBlocked: boolean;
  purchasingBlocked: boolean;
  itemCategoryId: string;
  inventoryPostingGroupId: string;
  genProdPostingGroupId: string;
  serviceBlocked: boolean;
  overReceiptCode: string;
  assemblyPolicy: string;
  routingNo: string;
  productionBOMNo: string;
  singleLevelMaterialCost: number;
  singleLevelCapacityCost: number;
  singleLevelSubcontrdCost: number;
  singleLevelCapOvhdCost: number;
  singleLevelMfgOvhdCost: number;
  overheadRate: number;
  rolledUpSubcontractedCost: number;
  rolledUpMfgOvhdCost: number;
  rolledUpCapOverheadCost: number;
  critical: boolean;
  commonItemNo: string;
  no2: string;
  searchDescription: string;
  description2: string;
  akiSKUID: number;
  akiProductID: string;
  akiCategoryID: string;
  akiSKUDescription: string;
  akiManufacturerRef: string;
  akiListOrder: number;
  akiObsolete: boolean;
  akiWebActive: boolean;
  akiImageURL: string;
  akiCommodityCode: string;
  akiGuidePriceTBC: number;
  akiGuideWeightTBC: number;
  akiSKUIsActive: boolean;
  akiCurrentlyPartRestricted: boolean;
  akiCountryOfOrigin: string;
  akiPrintLayoutTemp: boolean;
  akiAlternativeTitle: string;
  akiCompetitors: string;
  akiPriceBreaksTBC: boolean;
  itemclasscode: string;
  akiItemShippingWeight: number;
  itemUOfMeasureScheduleID: string;
  itemsellingUOfM: string;
  itemsupplierID: string;
  itemcreditoritemno: string;
  akiItemSiteID: string;
  akiItemPriceWebsiteSellPrice: number;
  itemstartingquantity: number;
  itemtype: string;
  itemvaluationMethod: string;
  akiItemPriceSiteSellPrice: number;
  akiItemShortDescription: string;
  akiTemplateID: number;
  akiAltSKUName: string;
  akiLayoutTemplate: string;
  akiPricingFormula: string;
  akiPriceBreak: string;
  akiPriceGroup: string;
  additionalImagesCount: number,
  urlLinksCount: number,
  akigpItemNumber: string,
}

export interface SkuRequestModel {
  skuName: string;
  akiSKUDescription?: string;
  akiManufacturerRef?: string;
  akiitemid?: string;
  akiProductID: string,
  akiCategoryID: string,
  akiListOrder?: string;
  akiObsolete: boolean;
  akiWebActive: boolean;
  akiCurrentlyPartRestricted: boolean;
  akiImageURL?: string;
  akiCommodityCode?: string;
  akiCountryOfOrigin?: string;
  akiSKUIsActive: boolean;
  akiGuidePriceTBC: number;
  akiGuideWeightTBC: number;
  akiAlternativeTitle?: string;
  akiLayoutTemplate?: string;
  akiCompetitors?: string;
  akiPriceBreak?: string;
  akiPriceGroup?: string;
  akiPricingFormula?: string;
  akiPrintLayoutTemp: boolean;
  additionalImagesCount?: string;
  urlLinksCount?: string;
  akiPriceBreaksTBC: boolean;
  akigpItemNumber: string,
}

export interface SkuListResponse {
  value: SKuList[];
  isSuccess: boolean;
  isError: boolean;
  exceptionInformation: any;
}

export interface LikedSkuModel {
  akiAttributeName: string;
  akiAttributeValue: string;
  akiItemNo: string;
  akiLink: boolean;
  odataetag?: string;
  linkedId?: number,
}


export interface RelatedSkuModel {
  akiitemid: string;
  akiObsolete?: boolean;
  akiCurrentlyPartRestricted?: boolean
}

export interface UpdateSKULinkedAttribute {
  linkedid?: number,
  akiItemNo: string,
  akiAttributeName: string,
  akiAttributeValue: string,
  akiLink: boolean
}

export interface RelatedSkuItem {
  relatedItemNo: string;
  relationType: string;
  relatedSKUName: string;
  itemManufactureRef: string;
  itemNo: string;
  itemObsolte: boolean;
  itemIsUnavailable: boolean;
  oDataEtag?: string;
  isrelatedSKU?: boolean;
}

export interface SKusRequestModelForProductOrderList {
  akiitemid?: string;
  oldlistorder: number,
  newlistorder: number
}


