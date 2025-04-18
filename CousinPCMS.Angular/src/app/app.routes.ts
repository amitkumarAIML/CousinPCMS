import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { SkusComponent } from './components/skus/skus.component';
import { LinkMaintenanceComponent } from './components/shared/link-maintenance/link-maintenance.component';
import { AdditionalImagesComponent } from './components/shared/additional-images/additional-images.component';
import { AttributesComponent } from './components/attributes/attributes.component';
import { AttributesDetailsComponent } from './components/attributes/attributes-details/attributes-details.component';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full',
//   },
//   {
//     path: 'home',
//     component: HomeComponent,
//   },
//   {
//     path: 'departments',
//     component: DepartmentsComponent,
//   },
//   { 
//     path: 'category',
//     component: CategoryComponent,
//   },
//   { 
//     path: 'products',
//     component: ProductComponent,
//   },
//   { 
//     path: 'skus',
//     component: SkusComponent,
//   },
//   { 
//     path: 'attributes',
//     component: AttributesComponent,
//   },
//   { 
//     path: 'attributes/add',
//     component: AttributesDetailsComponent,
//   },
//   { 
//     path: 'attributes/edit',
//     component: AttributesDetailsComponent,
//   },
//   { 
//     path: 'products/link-maintenance',
//     component: LinkMaintenanceComponent,
//   },
//   { 
//     path: 'products/additional-images',
//     component: AdditionalImagesComponent,
//   },
//   { 
//     path: 'category/link-maintenance',
//     component: LinkMaintenanceComponent,
//   },
//   { 
//     path: 'category/additional-images',
//     component: AdditionalImagesComponent,
//   },
//   { 
//     path: 'skus/link-maintenance',
//     component: LinkMaintenanceComponent,
//   },
//   { 
//     path: 'skus/additional-images',
//     component: AdditionalImagesComponent,
//   },

  
// ];


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('./components/departments/departments.component').then(
        (c) => c.DepartmentsComponent
      ),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./components/category/category.routes').then((m) => m.CATEGORY_ROUTES),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./components/product/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
  {
    path: 'skus',
    loadChildren: () =>
      import('./components/skus/skus.routes').then((m) => m.SKU_ROUTES),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./components/attributes/attributes.routes').then(
        (m) => m.ATTRIBUTES_ROUTES
      ),
  },

  // Add a wildcard route for 404 handling at the end, if needed
  // { path: '**', component: PageNotFoundComponent } // Make sure PageNotFoundComponent exists and is imported/standalone
];