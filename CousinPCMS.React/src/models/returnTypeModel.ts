export interface ReturnType {
    oDataEtag: string;
    description: string;
    id: number;
    returnType: string;
}

  
export interface ReturnTypeResponse {
    value: ReturnType[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}