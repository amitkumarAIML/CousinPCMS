import {createRoot} from 'react-dom/client';
import './index.css';
import {RouterProvider} from 'react-router';
import routes from './routes.ts';
import {ConfigProvider} from 'antd';
import theme from './theme.ts';
import {NotificationProvider} from './contexts.ts/NotificationProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={theme}>
    <NotificationProvider>
      <RouterProvider router={routes} />
    </NotificationProvider>
  </ConfigProvider>
);
