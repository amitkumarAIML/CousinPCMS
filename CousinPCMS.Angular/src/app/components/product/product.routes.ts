import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { LinkMaintenanceComponent } from '../shared/link-maintenance/link-maintenance.component';
import { AdditionalImagesComponent } from '../shared/additional-images/additional-images.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '', // '/products'
    component: ProductComponent,
    title: 'Product Management',
  },
  {
    path: 'link-maintenance', // '/products/link-maintenance'
    component: LinkMaintenanceComponent,
    title: 'Product Link Maintenance',
  },
  {
    path: 'additional-images', // '/products/additional-images'
    component: AdditionalImagesComponent,
    title: 'Product Additional Images',
  },
];