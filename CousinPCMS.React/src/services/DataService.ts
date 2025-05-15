import {http} from '../auth/HttpClient';
import {CommodityCode, CommodityCodeResponse} from '../models/commodityCodeModel';
import {Country, CountryResponse} from '../models/countryOriginModel';
import { ApiResponse } from '../models/generalModel';
import { TemplateLayout, TemplateLayoutResponse } from '../models/layoutTemplateModel';
import { ReturnType, ReturnTypeResponse } from '../models/returnTypeModel';


interface EmpTokenRequest {
  token: string;
}

export const empLogin = async (empToken: EmpTokenRequest): Promise<ApiResponse<any>> => {
  const response = await http.post<ApiResponse<any>>('Account/EmpLogin', empToken);
    return response;
};

export const getCountryOrigin = async (): Promise<Country[]> => {
  const response = await http.get<CountryResponse>('Account/GetCountryOrigin');
  return response.value;
};

export const getCommodityCodes = async (): Promise<CommodityCode[]> => {
  const response = await http.get<CommodityCodeResponse>('Account/GetCommodityCodes');
  return response.value;
};

export const getReturnTypes = async (): Promise<ReturnType[]> => {
  const response = await http.get<ReturnTypeResponse>('Account/GetReturnTypes');
  return response.value;
};

export const getLayoutTemplateList = async (): Promise<TemplateLayout[]> => {
  const response = await http.get<TemplateLayoutResponse>('Account/GetLayoutTemplates');
  return response.value;
};

export const getAllCategory = async (): Promise<any[]> => {
  const response = await http.get<any>('Category/GetAllCategory');
  return response.value;
};

export const extractUserMessage = (fullMsg: string): string => {
  const marker = /CorrelationId\s*:/i;
  const idx = fullMsg.search(marker);
  if (idx === -1) return fullMsg.trim();
  return fullMsg.slice(0, idx).replace(/\s+$/, '');
};



export const cleanEmptyNullToString = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === null || obj[key] ===  undefined ? '' : obj[key];
  }
  return result;
};

export const getSessionItem = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return null;
}

export const setSessionItem = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
} 

export const getPlainText = (html: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

