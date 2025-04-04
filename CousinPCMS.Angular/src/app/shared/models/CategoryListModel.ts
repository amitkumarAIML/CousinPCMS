export interface categoryListModel {
    oDataEtag: string;
    product: number;
    additionalCategory: number;
    listOrder: number;
    productName:string;
    webActive:boolean;
    categoryName:string;
}
export interface addAssociatedProductModel{
  product:number,
  additionalCategory: string,
  listorder: number,
  isAdditionalProduct:boolean
}
export interface editAssociatedProductModel{
  product:number,
  additionalCategory: string,
  listorder: number,
  isAdditionalProduct:boolean
}
export interface categoryDetailUpdatedModel{
    akiCategoryID: string,
    akiCategoryName: string,
    akiDepartment: string,
    akiCategoryGuidePrice: 0,
    akiCategoryGuideWeight: 0,
    akiCategoryCommodityCode: string,
    akiCategoryListOrder: 0,
    akiCategoryCountryOfOrigin: string,
    akiCategoryPromptUserIfPriceGroupIsBlank: true,
    akiCategoryWebActive: true,
    akiCategoryPopular: true,
    akiCategoryTickBoxNotInUse: true,
    akiCategoryUseComplexSearch: true,
    akiCategoryDescriptionText: string,
    akiCategoryImageURL: string,
    akiCategoryDiscount: 0,
    akiCategoryImageHeight: 0,
    akiCategoryImageWidth: 0,
    akiCategoryIncludeInSearchByManufacture: true,
    akiCategoryLogInAndGreenTickOnly: true,
    akiCategoryMinimumDigits: 0,
    akiCategoryReturnType: string,
    akI_Show_Category_Text: true,
    akI_Show_Category_Image: true,
    akI_Layout_Template: string,
    akiCategoryAlternativeTitle: string,
    akiCategoryShowPriceBreaks: true,
    akiCategoryIndex1: string,
    akiCategoryIndex2: string,
    akiCategoryIndex3: string,
    akiCategoryIndex4: string,
    akiCategoryIndex5: string,
    akiCategoryPrintCatText: string,
    akiCategoryPrintCatImage: string,
    akiCategoryPrintCatTemp: true,
    akI_Indentation: 0,
    akIdepartmentname: string
}