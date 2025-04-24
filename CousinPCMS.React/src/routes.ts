import {createBrowserRouter} from 'react-router';
import App from './App';
import Department from './pages/Department';
import Category from './pages/Category';
import SKUs from './pages/SKUs';
import Product from './pages/Product';
import Home from './pages/Home';
import Attributes from './pages/Attributes';

const routes = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'home',
        Component: Home,
      },
      {
        path: 'departments',
        Component: Department,
      },
      {
        path: 'category',
        Component: Category,
      },
      {
        path: 'products',
        Component: Product,
      },
      {
        path: 'SKUs',
        Component: SKUs,
      },
      {
        path: 'attributes',
        Component: Attributes,
      },
    ],
  },
]);

export default routes;
