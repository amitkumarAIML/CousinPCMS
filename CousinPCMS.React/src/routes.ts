import {createBrowserRouter} from 'react-router';
import App from './App';
import Home from './components/Home';

const routes = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        Component: Home,
      },
    ],
  },
]);

export default routes;
