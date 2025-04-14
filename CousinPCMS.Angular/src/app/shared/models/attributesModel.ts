export interface AttributeModel {
    odataetag: string;
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
    attributesIsActive: boolean;
  
}

export interface AttributeRequestModel {
    attributeName: string;
    attributeDescription: string;
    searchType: string;
    showAsCategory: boolean;
}

export interface AttributeValueModel {
    // odataetag: string;
    attributeName: string;
    attributeValue: string;
    newAlternateValue: string;
    alternateValues: string;
    // attributevalueIsActive: boolean;
}

export interface AttributeValuesRequestModel {
    attributeValue: string;
    attributeName: string;
    newAlternateValue: string;
    alternateValues: string;
    attributevalueIsActive: boolean;
}