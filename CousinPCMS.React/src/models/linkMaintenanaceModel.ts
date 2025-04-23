export interface LinkRequestModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    linkURL: string;
    linkText: string;
    toolTip: string;
    linkType: string;
}

export interface LinkDeleteRequestModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    linkURL: string;
}

export interface LinkValue {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    linkText: string;
    linkType: string;
    linkURL: string;
    toolTip: string;
}
  
