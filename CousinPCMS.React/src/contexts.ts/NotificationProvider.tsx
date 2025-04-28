import {message} from 'antd';
import {createContext, ReactNode, useContext} from 'react';

// infer the type of messageApi from useMessage():
type MessageApi = ReturnType<typeof message.useMessage>[0];

const NotificationContext = createContext<MessageApi | null>(null);

export function NotificationProvider({children}: {children: ReactNode}) {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <NotificationContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): MessageApi {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return api;
}
