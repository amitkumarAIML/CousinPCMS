import { http } from '../auth/HttpClient';
import { CommodityCode, CommodityCodeResponse } from '../models/commodityCodeModel';
import { Country, CountryResponse } from '../models/countryOriginModel';
import { message } from 'antd';
import { useNotification } from '../contexts/NotificationProvider';


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


export function showNotification(type: 'success' | 'error', msg: string) {
  // you can’t call hooks in plain modules—
  // so instead export a hook wrapper for components:
}

export const extractUserMessage = (fullMsg: string): string => {
  const marker = /CorrelationId\s*:/i;
  const idx = fullMsg.search(marker);
  if (idx === -1) return fullMsg.trim();
  return fullMsg.slice(0, idx).replace(/\s+$/, '');
}

