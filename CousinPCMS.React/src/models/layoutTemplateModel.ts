export interface layoutDepartment {
    oDataEtag: string;
    departmentId: number;
    templateCode: string;
    layoutDescription: string;
}

  
export interface layoutDepartmentResponse {
    value: layoutDepartment[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}


export interface layoutProduct {
    oDataEtag: string;
    productId: number;
    templateCode: string;
    layoutDescription: string;
}

  
export interface layoutProductResponse {
    value: layoutProduct[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}

export interface layoutSkus {
    oDataEtag: string;
    itemId: number;
    templateCode: string;
    layoutDescription: string;
}

  
export interface layoutSkusResponse {
    value: layoutSkus[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}