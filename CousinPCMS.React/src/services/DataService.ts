import { http } from '../auth/HttpClient';
import { CommodityCode, CommodityCodeResponse } from '../models/commodityCodeModel';
import { Country, CountryResponse } from '../models/countryOriginModel';



// Country origin
export const getCountryOrigin = async (): Promise<Country[]> => {
  const response = await http.get<CountryResponse>('Account/GetCountryOrigin');
  return response.value;
};

// Commodity codes
export const getCommodityCodes = async (): Promise<CommodityCode[]> => {
  const response = await http.get<CommodityCodeResponse>('Account/GetCommodityCodes');
  return response.value;
};

// All categories
export const getAllCategory = async (): Promise<any[]> => {
  const response = await http.get<any>('Category/GetAllCategory');
  return response.value;
};



export const extractUserMessage = (fullMsg: string): string => {
  const marker = /CorrelationId\s*:/i;
  const idx = fullMsg.search(marker);
  if (idx === -1) return fullMsg.trim();
  return fullMsg.slice(0, idx).replace(/\s+$/, '');
}


export const cleanEmptyNullToString = (obj: any)  => {
  const result: any = {};
  for (const key in obj) {
    result[key] = obj[key] === null ? '' : obj[key];
  }
  return result;
}

