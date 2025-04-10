import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { SkusComponent } from './components/skus/skus.component';
import { LinkMaintenanceComponent } from './components/shared/link-maintenance/link-maintenance.component';
import { AdditionalImagesComponent } from './components/shared/additional-images/additional-images.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
  },
  { 
    path: 'category',
    component: CategoryComponent,
  },
  { 
    path: 'products',
    component: ProductComponent,
  },
  { 
    path: 'skus',
    component: SkusComponent,
  },
  { 
    path: 'products/link-maintenance',
    component: LinkMaintenanceComponent,
  },
  { 
    path: 'products/additional-images',
    component: AdditionalImagesComponent,
  },
  { 
    path: 'category/link-maintenance',
    component: LinkMaintenanceComponent,
  },
  { 
    path: 'category/additional-images',
    component: AdditionalImagesComponent,
  },
  { 
    path: 'skus/link-maintenance',
    component: LinkMaintenanceComponent,
  },
  { 
    path: 'skus/additional-images',
    component: AdditionalImagesComponent,
  },

  
];
