import React, {useState, useEffect, ReactNode} from 'react';
import {Country} from '../models/countryOriginModel';
import {CommodityCode} from '../models/commodityCodeModel';
import {ReturnType} from '../models/returnTypeModel';
import {TemplateLayout} from '../models/layoutTemplateModel';
import {getCommodityCodes, getCountryOrigin, getLayoutTemplateList, getReturnTypes} from '../services/DataService';
import {CommonDataContext} from './CommonDataContext';

export const CommonDataProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [commodityCodes, setCommodityCodes] = useState<CommodityCode[] | null>(null);
  const [returnTypes, setReturnTypes] = useState<ReturnType[] | null>(null);
  const [templateLayouts, setTemplateLayouts] = useState<TemplateLayout[] | null>(null);

  const [loading, setLoading] = useState({
    countries: false,
    commodityCodes: false,
    returnTypes: false,
    templateLayouts: false,
  });
  const [hasFetched, setHasFetched] = useState(false); // Track if initial fetch has occurred

  const fetchAllCommonData = async () => {
    if (hasFetched) return; // Don't re-fetch if already done

    setLoading({
      countries: true,
      commodityCodes: true,
      returnTypes: true,
      templateLayouts: true,
    });
    setHasFetched(true); // Mark as fetched immediately to prevent race conditions

    try {
      const [countriesData, commodityCodesData, returnTypesData, templateLayoutsData] = await Promise.all([
        getCountryOrigin().catch((err) => {
          console.error('Error fetching countries:', err);
          return [];
        }), // Provide default on error
        getCommodityCodes().catch((err) => {
          console.error('Error fetching commodity codes:', err);
          return [];
        }),
        getReturnTypes().catch((err) => {
          console.error('Error fetching return types:', err);
          return [];
        }),
        getLayoutTemplateList().catch((err) => {
          console.error('Error fetching template layouts:', err);
          return [];
        }),
      ]);

      setCountries(countriesData);
      setCommodityCodes(commodityCodesData);
      setReturnTypes(returnTypesData);
      setTemplateLayouts(templateLayoutsData.sort((a, b) => Number(a.templateCode) - Number(b.templateCode)));
    } catch (err) {
      console.error('Failed to fetch common data:', err);
      setHasFetched(false);
    } finally {
      setLoading({
        countries: false,
        commodityCodes: false,
        returnTypes: false,
        templateLayouts: false,
      });
    }
  };

  useEffect(() => {
    if (!hasFetched) {
      fetchAllCommonData();
    }
  }, [hasFetched]);

  const fetchCommonDataIfNeeded = async () => {
    if (!countries || !commodityCodes || !returnTypes || !templateLayouts) {
      await fetchAllCommonData();
    }
  };

  return (
    <CommonDataContext.Provider
      value={{
        countries,
        commodityCodes,
        returnTypes,
        templateLayouts,
        loading,
        fetchCommonDataIfNeeded,
      }}
    >
      {children}
    </CommonDataContext.Provider>
  );
};
