export interface AdditionalImagesModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    imageURL: string;
    imagename: string;
}

export interface AdditionalImageDeleteRequestModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    imageURL: string;
}
  
