import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';

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
  }
  
];
