import {createBrowserRouter, Outlet} from 'react-router';
import {lazy} from 'react';
import withSuspense from './utils/withSuspense';
import ProtectedRoute from './utils/ProtectedRoute';
import NotFound from './pages/NotFound';

// Lazy load pages
const App = withSuspense(lazy(() => import('./App')));
const Home = withSuspense(lazy(() => import('./pages/Home')));
const Department = withSuspense(lazy(() => import('./pages/Department')));
const Category = withSuspense(lazy(() => import('./pages/Category')));
const SKUs = withSuspense(lazy(() => import('./pages/SKUs')));
const Product = withSuspense(lazy(() => import('./pages/Product')));
const Attributes = withSuspense(lazy(() => import('./pages/Attributes')));
const AdditionalImages = withSuspense(lazy(() => import('./components/shared/AdditionalImages')));
const AttributeForm = withSuspense(lazy(() => import('./components/attribute/AttributeForm')));
const AttributeMultiUpload = withSuspense(lazy(() => import('./components/attribute/AttributeMultiUpload')));
const LinkMaintenance = withSuspense(lazy(() => import('./components/shared/LinkMaintenance')));

const routes = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'home',
            Component: Home,
          },
          {
            path: 'departments',
            children: [
              {path: '', Component: Department},
              {path: 'Add', Component: Department},
              {path: 'Edit', Component: Department},
            ],
          },
          {
            path: 'category',
            children: [
              {path: '', Component: Category},
              {path: 'add', Component: Category},
              {path: 'edit', Component: Category},
              {path: 'additional-images', Component: AdditionalImages},
              {path: 'link-maintenance', Component: LinkMaintenance},
            ],
          },
          {
            path: 'products',
            children: [
              {path: '', Component: Product},
              {path: 'add', Component: Product},
              {path: 'edit', Component: Product},
              {path: 'additional-images', Component: AdditionalImages},
              {path: 'link-maintenance', Component: LinkMaintenance},
            ],
          },
          {
            path: 'SKUs',
            children: [
              {path: '', Component: SKUs},
              {path: 'add', Component: SKUs},
              {path: 'edit', Component: SKUs},
              {path: 'additional-images', Component: AdditionalImages},
              {path: 'link-maintenance', Component: LinkMaintenance},
              {path: 'attribute-multi-upload', Component: AttributeMultiUpload},
            ],
          },
          {
            path: 'attributes',
            children: [
              {path: '', Component: Attributes},
              {path: 'add', Component: AttributeForm},
              {path: 'edit', Component: AttributeForm},
            ],
          },
        ],
      },
      {
        path: '404',
        Component: NotFound,
      },
      {
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);

export default routes;
