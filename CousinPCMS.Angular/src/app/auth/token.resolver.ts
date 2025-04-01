import type {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import { DataService } from '../shared/services/data.service';

export const tokenResolver: ResolveFn<boolean> = async () => {
  const dataService = inject(DataService);
  try {
    dataService.getToken().subscribe();
    return true;
  } catch {
    return false;
  }
};
