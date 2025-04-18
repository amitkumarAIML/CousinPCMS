import {Routes} from '@angular/router';

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