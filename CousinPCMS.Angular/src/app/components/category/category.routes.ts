import { Routes } from '@angular/router';
import { CategoryComponent } from './category.component'; // Path to your component
// Assuming shared components are in a shared location
import { LinkMaintenanceComponent } from '../shared/link-maintenance/link-maintenance.component';
import { AdditionalImagesComponent } from '../shared/additional-images/additional-images.component';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '', 
    component: CategoryComponent,
    title: 'Category Management',
  },
  {
    path: 'link-maintenance',
    component: LinkMaintenanceComponent,
    title: 'Category Link Maintenance',
  },
  {
    path: 'additional-images', // Corresponds to '/category/additional-images'
    component: AdditionalImagesComponent,
    title: 'Category Additional Images',
  },
];