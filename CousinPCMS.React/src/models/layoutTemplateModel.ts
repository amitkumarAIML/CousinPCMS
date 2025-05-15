export interface TemplateLayout {
    oDataEtag: string;
    departmentId: number;
    templateCode: string;
    layoutDescription: string;
    forcategory: boolean,
    forproducts: boolean,
    forsku: boolean,
    fordepartment: boolean
}

  
export interface TemplateLayoutResponse {
    value: TemplateLayout[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
}