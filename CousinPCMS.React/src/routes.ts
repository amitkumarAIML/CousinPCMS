import {createBrowserRouter} from 'react-router';
import App from './App';
import Home from './components/Home';
import Department from './pages/Department';
import Category from './pages/Category';
import SKUs from './pages/SKUs';
import Product from './pages/Product';

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
    ],
  },
]);

export default routes;
