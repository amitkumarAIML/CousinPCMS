import { Routes } from '@angular/router';
import { AttributesComponent } from './attributes.component';
// Assuming AttributesDetailsComponent lives within the attributes feature folder
import { AttributesDetailsComponent } from './attributes-details/attributes-details.component';

export const ATTRIBUTES_ROUTES: Routes = [
  {
    path: '', // '/attributes'
    component: AttributesComponent,
    title: 'Attribute Management',
  },
  {
    path: 'add', 
    component: AttributesDetailsComponent,
    title: 'Add Attribute',
  },
  {
    path: 'edit', 
    component: AttributesDetailsComponent,
    title: 'Edit Attribute',
  },
];