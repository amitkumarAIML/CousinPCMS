export interface AttributeModel {
    odataetag: string;
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
    attributesIsActive: boolean;
  }
  export interface AddAttributeModel {
    attributeSetName: string;
    attributeName: string;
    attributeRequired: boolean;
    notImportant: boolean;
    listPosition: number;
  }
  
  