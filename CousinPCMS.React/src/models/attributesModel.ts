export interface AttributeModel {
    odataetag: string;
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
    attributesIsActive: boolean;
    id?: number;
  
}

export interface AttributeRequestModel {
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
}

export interface AttributeValueModel {
    attributeName: string;
    attributeValue: string;
    newAlternateValue: string;
    alternateValues: string;
    id?: number
    attributeValueLinkedToSKU?: boolean
    attributevalueIsActive?: boolean;
}

export interface AttributeValuesRequestModel {
    attributeValue: string;
    attributeName: string;
    newAlternateValue: string;
    alternateValues: string;
    attributevalueIsActive: boolean;
}

export interface AttributeValueByName { 
    attributeNames: Array<string>;
}