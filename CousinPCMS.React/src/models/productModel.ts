export interface Product {
    akI_Layout_Template: string;
    akiCategoryID: string;
    akiProductAlternativeTitle: string;
    akiProductCommodityCode: string;
    akiProductCountryOfOrigin: string;
    akiProductDescription: string;
    akiProductHeading: string;
    akiProductID: number;
    akiProductImageHeight: number;
    akiProductImageURL: string;
    akiProductImageWidth: number;
    akiProductIndexText1: string;
    akiProductIndexText2: string;
    akiProductIndexText3: string;
    akiProductIndexText4: string;
    akiProductIndexText5: string;
    akiProductIsActive: boolean;
    akiProductListOrder: number;
    akiProductName: string;
    akiProductPrintLayoutTemp: boolean;
    akiProductShowPriceBreaks: boolean;
    akiProductText: string;
    akiProductWebActive: boolean;
    category_Name: string;
    iscommoditychange: boolean,
    iscountrychange: boolean
    odataetag: string;
    additionalImagesCount: number,
    urlLinksCount: number
}

export interface ProductRequest {
    akiCategoryID: string;
    akiProductID: number;
    akiProductName: string;
    akiProductHeading: string;
    akiProductListOrder: number;
    akiProductWebActive: boolean;
    akiProductCommodityCode: string;
    akiProductCountryOfOrigin: string;
    akiProductImageURL: string;
    akiProductImageHeight: number;
    akiProductImageWidth: number;
    akiProductAlternativeTitle: string;
    aki_Layout_Template: string;
    akiProductShowPriceBreaks: boolean;
    akiProductPrintLayoutTemp: boolean;
    akiProductIndexText1: string;
    akiProductIndexText2: string;
    akiProductIndexText3: string;
    akiProductIndexText4: string;
    akiProductIndexText5: string;
    categoryName: string;
    akiProductText: string;
    iscommoditychange: boolean,
    iscountrychange: boolean

}


export interface ProductResponse {
    value: Product[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: unknown;
}


export interface ProductListApiResponse {
  totalRecords: number;
  products: Product[];
}


export interface ProductUpdateResponse {
    value: Product;
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: unknown;
}
export interface AssociatedProductRequestModelForProduct{
    product?:number;
    addproduct:string;
    listorder:number;
}

export interface DeleteAssociatedProductModelForProduct{
  product:number;
  addproduct:string;
}
export interface AdditionalProductModel {
    oDataEtag: string;
    product: number;
    additionalProduct: number;
    listOrder: number;
    productName: string;
    webActive: boolean;
    additionalProductName: string;
  }
  export interface AdditionalProductResponse {
    value: AdditionalProductModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: unknown;
  }

  export interface AdditionalProductResponse {
    value: AdditionalProductModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: unknown;
  }

  export interface ProductRequestModelForProductOrderList{
    akiProductID?:number;
    oldlistorder: number,
    newlistorder: number
}
