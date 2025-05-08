export interface LinkRequestModel {
    categoryID?: string;
    productID?: number;
    skuItemID?: string;
    linkURL: string;
    linkText: string;
    toolTip: string;
    linkType: string;
    listorder: number;
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
    listorder?: number
    categoryurlID?: number;
    producturlID?: number;
    skuitemURLid?: number;
}
  
export interface UpdateLinkOrderModel {
    categoryID?: string;
    skuItemID?: string;
    productID?: number;

    categoryurlID?: number;
    producturlID?: number;
    skuitemURLID?: number;

    oldlistorder?: number;
    newlistorder?: number;
}
