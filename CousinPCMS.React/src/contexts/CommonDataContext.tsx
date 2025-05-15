import {createContext} from 'react';
import {Country} from '../models/countryOriginModel';
import {CommodityCode} from '../models/commodityCodeModel';
import {ReturnType} from '../models/returnTypeModel';
import {TemplateLayout} from '../models/layoutTemplateModel';

export interface CommonDataContextState {
  countries: Country[] | null;
  commodityCodes: CommodityCode[] | null;
  returnTypes: ReturnType[] | null;
  templateLayouts: TemplateLayout[] | null;
  loading: {
    countries: boolean;
    commodityCodes: boolean;
    returnTypes: boolean;
    templateLayouts: boolean;
  };
  fetchCommonDataIfNeeded: () => Promise<void>; // Optional: allow components to trigger fetch
}

export const CommonDataContext = createContext<CommonDataContextState | undefined>(undefined);
