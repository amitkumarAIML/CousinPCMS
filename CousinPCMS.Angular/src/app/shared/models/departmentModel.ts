
export interface Department{
    akI_Catalogue_Active: boolean;
    akI_Color: string;
    akI_DeptPromptUserIfBlank: boolean;
    akI_Dept_Parent: number;
    akI_Featured_Prod_BG_Color: string;
    akI_Layout_Template: string;
    akiDepartmentCommodityCode: string;
    akiDepartmentDescText: string;
    akiDepartmentID: number;
    akiDepartmentImageHeight: number;
    akiDepartmentImageURL: string;
    akiDepartmentImageWidth: number;
    akiDepartmentKeyWords: string;
    akiDepartmentListOrder: number;
    akiDepartmentName: string;
    akiDepartmentWebActive: boolean;
    akI_DepartmentIsActive: boolean;
}

export interface DepartmentResponse {
    value: Department[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}


export interface DepartmentUpdateResponse {
    value: Department;
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}



export interface DepartmentRequest {
    akI_Catalogue_Active: boolean;
    akI_Color: string;
    akI_DeptPromptUserIfBlank: boolean;
    akI_Dept_Parent: number;
    akI_Featured_Prod_BG_Color: string;
    akI_Layout_Template: string;
    akiDepartmentCommodityCode: string;
    akiDepartmentDescText: string;
    akiDepartmentID: number;
    akiDepartmentImageHeight: number;
    akiDepartmentImageURL: string;
    akiDepartmentImageWidth: number;
    akiDepartmentKeyWords: string;
    akiDepartmentListOrder: number;
    akiDepartmentName: string;
    akiDepartmentWebActive: boolean;
    akI_DepartmentIsActive: boolean;
}


