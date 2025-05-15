import {useContext} from 'react';
import {CommonDataContext, CommonDataContextState} from '../contexts/CommonDataContext';

export const useCommonData = (): CommonDataContextState => {
  const context = useContext(CommonDataContext);
  if (context === undefined) {
    throw new Error('useCommonData must be used within a CommonDataProvider');
  }
  return context;
};
