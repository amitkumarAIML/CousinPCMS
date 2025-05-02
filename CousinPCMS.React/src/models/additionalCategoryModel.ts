export interface AdditionalCategoryModel {
    oDataEtag: string;
    product: number;
    additionalCategory: number;
    listOrder: number;
    productName:string;
    webActive:boolean;
    categoryName:string;
    isAdditionalProduct: boolean
}
export interface AssociatedProductRequestModel{
  product:number,
  additionalCategory: string,
  listorder: number,
  isAdditionalProduct:boolean
}
export interface UpdateCategoryModel{
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
    akI_Layout_Template?: string
}
 
export interface CategoryResponseModel {
  odataetag: string;
  akiCategoryID: string;
  akiCategoryName: string;
  akiCategoryParentID: string;
  akiDepartment: string;
  akiCategoryGuidePrice: number;
  akiCategoryGuideWeight: number;
  akiCategoryCommodityCode: string;
  akiCategoryListOrder: number;
  akiCategoryCountryOfOrigin: string;
  akiCategoryPromptUserIfPriceGroupIsBlank: boolean;
  akiCategoryWebActive: boolean;
  akiCategoryPopular: boolean;
  akiCategoryTickBoxNotInUse: boolean;
  akiCategoryUseComplexSearch: boolean;
  akiCategoryDescriptionText: string;
  akiCategoryImageURL: string;
  akiCategoryDiscount: number;
  akiCategoryImageHeight: number;
  akiCategoryImageWidth: number;
  akiCategoryIncludeInSearchByManufacture: boolean;
  akiCategoryLogInAndGreenTickOnly: boolean;
  akiCategoryMinimumDigits: number;
  akiCategoryReturnType: string;
  akiCategoryIsActive: boolean;
  akI_Show_Category_Text: boolean;
  akI_Show_Category_Image: boolean;
  akI_Layout_Template: string;
  akiCategoryAlternativeTitle: string;
  akiCategoryShowPriceBreaks: boolean;
  akiCategoryIndex1: string;
  akiCategoryIndex2: string;
  akiCategoryIndex3: string;
  akiCategoryIndex4: string;
  akiCategoryIndex5: string;
  akiCategoryPrintCatText: string;
  akiCategoryPrintCatImage: string;
  akiCategoryPrintCatTemp: boolean;
  akI_Indentation: number;
  akIdepartmentname: string;
}

export interface categorylayout {
  oDataEtag: string;
  categoryId: number;
  templateCode: string;
  layoutDescription: string;
}
export interface categorylayoutResponse {
    value: categorylayout[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}
export interface categoryResponse {
    value: CategoryResponseModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}

export interface categoryUpdateResponse {
    value: UpdateCategoryModel;
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}
export interface AdditionalCategoryResponse {
  value: AdditionalCategoryModel[];
  isSuccess: boolean;
  isError: boolean;
  exceptionInformation: any;
}
export interface DeleteAssociatedProductModel{
  product: number
  prodCategory:string
}