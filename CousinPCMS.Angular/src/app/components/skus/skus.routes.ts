import { Routes } from '@angular/router';
import { SkusComponent } from './skus.component';
import { LinkMaintenanceComponent } from '../shared/link-maintenance/link-maintenance.component';
import { AdditionalImagesComponent } from '../shared/additional-images/additional-images.component';
import { AttributeMultiUploadComponent } from './attribute-multi-upload/attribute-multi-upload.component';

export const SKU_ROUTES: Routes = [
  {
    path: '', // '/skus'
    component: SkusComponent,
    title: 'SKU Management',
  },
  {
    path: 'link-maintenance', // '/skus/link-maintenance'
    component: LinkMaintenanceComponent,
    title: 'SKU Link Maintenance',
  },
  {
    path: 'additional-images', // '/skus/additional-images'
    component: AdditionalImagesComponent,
    title: 'SKU Additional Images',
  },
  {
    path: 'attribute-multi-upload', // '/skus/additional-images'
    component: AttributeMultiUploadComponent,
    title: 'SKU Attribute Multi Upload',
  },
];