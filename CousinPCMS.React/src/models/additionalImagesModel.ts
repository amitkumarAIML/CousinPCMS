export interface AdditionalImagesModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;

    imageURL: string;
    imagename: string;
    listorder?: number;


    catimageid?: number;
    productImageID?: number;
    skuImageID?: number
}

export interface AdditionalImageDeleteRequestModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    imageURL: string;
}

export interface UpdateAdditionalImagesModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    
    imageURL: string;
    imagename: string;
    listorder?: number;

    catimageid?: number;
    productImageID?: number;
    skuImageID?: number;

    newListOrder?: number;
    oldListOrder?: number;
}
 
  
