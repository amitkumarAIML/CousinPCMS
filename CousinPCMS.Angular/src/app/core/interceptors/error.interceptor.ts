import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError, switchMap} from 'rxjs';
import { DataService } from '../../shared/services/data.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dataService = inject(DataService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        return dataService.getToken().pipe(
          switchMap(() => {
            const newToken = sessionStorage.getItem('BCP-Token');
            const newReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(newReq);
          }),
          catchError((refreshErr) => {
              return throwError(() => refreshErr);
          }),
        );
      } else {
        return throwError(() => err);
      }
    }),
  );
};
