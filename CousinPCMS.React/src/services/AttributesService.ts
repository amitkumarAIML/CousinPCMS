import {http} from '../auth/HttpClient';
import {ItemModel} from '../models/itemModel';
import {ApiResponse} from '../models/generalModel';
import {AttributeModel, AttributeRequestModel, AttributeValueModel, AttributeValuesRequestModel} from '../models/attributesModel';

export const addAttributes = async (attributesData: AttributeRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Attributes/AddAttributes', attributesData);
  return response;
};

export const updateAttributes = async (attributesData: AttributeRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Attributes/UpdateAttributes', attributesData);
  return response;
};

export const addAttributesValues = async (attributesData: AttributeValuesRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Attributes/AddAttributesValues', attributesData);
  return response;
};

export const deleteAttributesValues = async (attributeName: string, attributeValue: string): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Attributes/DeleteAttributeValue', {params: {attributeName, attributeValue}});
  return response;
};

export const deleteAttributes = async (attributeName: string): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Attributes/DeleteAttribute', {params: {attributeName}});
  return response;
};

export const getAttributesList = async (): Promise<ApiResponse<AttributeModel[]>> => {
  const response = await http.get<ApiResponse<AttributeModel[]>>('Attributes/GetAllAttributes');
  return response;
};

export const getAttributeSearchTypes = async (): Promise<ApiResponse<ItemModel[]>> => {
  const response = await http.get<ApiResponse<ItemModel[]>>('Attributes/GetAttributeSearchTypes');
  return response;
};

export const getAttributeValues = async (): Promise<ApiResponse<AttributeValueModel[]>> => {
  const response = await http.get<ApiResponse<AttributeValueModel[]>>('Attributes/GetAllAttributeValues');
  return response;
};

export const getAttributeByAttributesName = async (attributeName: string): Promise<ApiResponse<AttributeModel[]>> => {
  const response = await http.get<ApiResponse<AttributeModel[]>>('Attributes/GetAllAttributesByAttributeName', {params: {attributeName}});
  return response;
};

export const getAttributeValuesByAttributesName = async (attributeName: string): Promise<ApiResponse<AttributeValueModel[]>> => {
  const response = await http.get<ApiResponse<AttributeValueModel[]>>('Attributes/GetAllAttributeValuesByAttribute', {params: {attributeName}});
  return response;
};
