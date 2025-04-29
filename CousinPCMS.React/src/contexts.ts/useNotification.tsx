import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import type { MessageApi } from './NotificationProvider';

export function useNotification(): MessageApi {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return api;
}
