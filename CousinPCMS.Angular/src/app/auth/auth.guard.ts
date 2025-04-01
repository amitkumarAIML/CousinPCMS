import {inject} from '@angular/core';
import {CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const validUser = JSON.parse(sessionStorage.getItem('valid-user') || 'null');

  if (!validUser) {
    router.navigate(['/login']);
    return false;
  }

  const url: string = state.url;

  const isAgent =
    validUser.agentCode !== null && validUser.agentCode !== undefined && validUser.agentCode !== '';

  if (validUser.isEmployee) {
    return true;
  }

  if (url.startsWith('/warehouse-shipment')) {
    if ((isAgent && validUser.isVendor) || (isAgent && !validUser.isCustomer)) {
      return true;
    }
    router.navigate(['/shipment']);
    return false;
  }

  if (url.startsWith('/shipment')) {
    if (validUser.isCustomer || isAgent) {
      return true;
    }
    router.navigate(['/purchase']);
    return false;
  }

  if (url.startsWith('/purchase')) {
    if (validUser.isVendor) {
      return true;
    }
    router.navigate(['/shipment']);
    return false;
  }

  if (url.startsWith('/work-center')) {
    if ( validUser.isVendor) {
      return true;
    }
    router.navigate(['/shipment']);
    return false;
  }

  if (url.startsWith('/job-planning')) {
    router.navigate(['/shipment']);
    return false;
  }

  router.navigate(['/shipment']);
  return false;
};
