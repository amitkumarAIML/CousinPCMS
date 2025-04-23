import { http } from '../auth/HttpClient';
import { CommodityCode, CommodityCodeResponse } from '../models/commodityCodeModel';
import { Country, CountryResponse } from '../models/countryOriginModel';
import { message } from 'antd';

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

export function showNotification(type: 'success' | 'error' | 'warning' | 'info', details: string) {
  switch (type) {
    case 'success':
      message.success(details);
      break;
    case 'error':
      message.error(details);
      break;
    case 'warning':
      message.warning(details);
      break;
    case 'info':
      message.info(details);
      break;
    default:
      message.info(details);
      break;
  }
}

