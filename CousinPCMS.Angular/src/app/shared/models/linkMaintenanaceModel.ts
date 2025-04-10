export interface LinkRequestModel {
    categoryID?: string;
    productID?: number;
    linkURL: string;
    linkText: string;
    toolTip: string;
    linkType: string;
}

export interface LinkDeleteRequestModel {
    categoryID?: string;
    productID?: number;
    linkURL: string;
}

export interface LinkValue {
    categoryID?: string;
    productID?: number;
    linkText: string;
    linkType: string;
    linkURL: string;
    toolTip: string;
}
  
