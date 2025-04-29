import { createContext } from 'react';
import type { MessageApi } from './NotificationProvider';

export const NotificationContext = createContext<MessageApi | null>(null);
