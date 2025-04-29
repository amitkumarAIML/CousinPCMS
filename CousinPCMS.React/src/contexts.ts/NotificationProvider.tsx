import {message} from 'antd';
import {ReactNode} from 'react';
import { NotificationContext } from './NotificationContext';

export type MessageApi = ReturnType<typeof message.useMessage>[0];

export function NotificationProvider({children}: {children: ReactNode}) {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <NotificationContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
