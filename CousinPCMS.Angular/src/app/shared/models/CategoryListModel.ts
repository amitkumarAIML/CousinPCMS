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

    akiCategoryID: string;
   
    akiCategoryParentID: string;
    akiCategoryName: string;  
    akiCategoryGuidePrice: number;
    akiCategoryGuideWeight: number;
    akiCategoryListOrder: number;
    akiCategoryPopular: boolean;
    akiCategoryImageURL: string;
    akiCategoryImageHeight: number;
    akiCategoryImageWidth: number;
    akiCategoryIncludeInSearchByManufacture: boolean;
    akiCategoryMinimumDigits: number;
    akiCategoryReturnType: string;
    akiCategoryShowPriceBreaks: boolean;
    akiCategoryCommodityCode: string;
    akiCategoryPromptUserIfPriceGroupIsBlank: boolean;
    akiCategoryCountryOfOrigin: string;
    akiCategoryTickBoxNotInUse: boolean;
    akiCategoryUseComplexSearch: boolean;
    akiCategoryDiscount: number;
    akiCategoryLogInAndGreenTickOnly: boolean;
    akiCategoryPrintCatImage: string;
    akiCategoryPrintCatTemp: boolean;
    akiCategoryAlternativeTitle: string;
    akiCategoryIndex1: string;
    akiCategoryIndex2: string;
    akiCategoryIndex3: string;
    akiCategoryIndex4: string;
    akiCategoryIndex5: string;
    aki_Indentation: number;
    akiDepartment: string;
    akidepartmentname: string;
    aki_Show_Category_Text: boolean;
    aki_Show_Category_Image: boolean;
    aki_Layout_Template: string;
    akiCategoryWebActive: boolean;
    akiCategoryDescriptionText:string;
}
  