export interface ItemModel {
    oDataEtag: string;
    code: string;
    description: string;
}

  
export interface ItemModelResponse {
    value: ItemModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}