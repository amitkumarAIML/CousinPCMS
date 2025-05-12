import {useContext} from 'react';
import {NotificationContext} from '../contexts/NotificationContext';
import type {MessageApi} from '../contexts/NotificationProvider';

export function useNotification(): MessageApi {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return api;
}
