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
    skuItemID?: string;
    
    // imageURL: string;
    // imagename: string;
    // listorder?: number;
    // productID?: number;

    catimageid?: number;
    productimageid?: number;
    skuImageID?: number;

    oldlistorder?: number;
    newlistorder?: number;
}
 
  
