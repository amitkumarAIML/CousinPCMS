import {createBrowserRouter} from 'react-router';
import App from './App';
import Department from './pages/Department';
import Category from './pages/Category';
import SKUs from './pages/SKUs';
import Product from './pages/Product';
import Home from './pages/Home';
import Attributes from './pages/Attributes';
import AdditionalImages from './components/AdditionalImages';
import LinkMaintenance from './components/LinkMaintenance';
import AttributeForm from './components/attribute/AttributeForm';
import AttributeMultiUpload from './components/attribute/AttributeMultiUpload';

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
        children: [
          {
            path: 'Add',
            Component: Department,
          },
          {
            path: 'Edit',
            Component: Department,
          },
        ],
      },
      {
        path: 'category',
        children: [
          {path: 'add', Component: Category},
          {path: 'edit', Component: Category},
          {
            path: 'additional-images',
            Component: AdditionalImages,
          },
          {
            path: 'link-maintenance',
            Component: LinkMaintenance,
          },
        ],
      },
      {
        path: 'products',
        children: [
          {path: 'add', Component: Product},
          {path: 'edit', Component: Product},
        ],
      },
      {
        path: 'SKUs',
        children: [
          {path: 'add', Component: SKUs},
          {path: 'edit', Component: SKUs},
          {
            path: 'attribute-multi-upload',
            Component: AttributeMultiUpload,
          },
        ],
      },
      {
        path: 'attributes',
        children: [
          {
            path: '',
            Component: Attributes,
          },
          {
            path: 'add',
            Component: AttributeForm,
          },
          {
            path: 'edit',
            Component: AttributeForm,
          },
        ],
      },
    ],
  },
]);

export default routes;
