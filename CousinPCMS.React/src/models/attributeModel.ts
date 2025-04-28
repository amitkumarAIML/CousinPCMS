export interface AttributeModel {
    odataetag: string;
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
    attributesIsActive: boolean;
  }
  export interface AddAttributeSetRequestModel {
    attributeSetName: string;
    categoryID:string;
    attributeName: string;
    attributeRequired: boolean;
    notImportant: boolean;
    listPosition: number;
  }
  export interface AttributeSetModel {
    odataetag: string;
    attributeSetName: string;
    attributeName: string;
    attributeRequired: boolean;
    notImportant: boolean;
    listPosition: number;
    attributesetIsActive: boolean;
    akiCategoryID?: number;
  }
  
  export interface AttributeModelResponse {
    value: AttributeModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
  }
  export interface AttributeSetModelResponse {
    value: AttributeSetModel[];
    isSuccess: boolean;
    isError: boolean;
    exceptionInformation: any;
  }