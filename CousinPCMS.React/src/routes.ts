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
            path: '',
            Component: Department,
          },
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
          {path: '', Component: Category},
          {path: 'add', Component: Category},
          {
            path: 'additional-images',
            Component: AdditionalImages,
          },
          {
            path: 'link-maintenance',
            Component: LinkMaintenance,
          },
          {path: 'edit', Component: Category},
        ],
      },
      {
        path: 'products',
        children: [
          {
            path: '',
            Component: Product,
          },
          {
            path: 'additional-images',
            Component: AdditionalImages,
          },
          {
            path: 'link-maintenance',
            Component: LinkMaintenance,
          },
          {path: 'add', Component: Product},
          {path: 'edit', Component: Product},
        ],
      },
      {
        path: 'SKUs',
        children: [
          {
            path: '',
            Component: SKUs,
          },
          {path: 'add', Component: SKUs},
          {path: 'edit', Component: SKUs},
          {
            path: 'additional-images',
            Component: AdditionalImages,
          },
          {
            path: 'link-maintenance',
            Component: LinkMaintenance,
          },
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
