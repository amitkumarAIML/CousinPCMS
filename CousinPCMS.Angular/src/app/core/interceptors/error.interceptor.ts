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
             // Handle 500 Server Error
              if (refreshErr.status === 500) {
                console.error('Server Error:', refreshErr);
                dataService.ShowNotification('error', '' , 'An unexpected error occurred on the server.');
              }
              
              // Handle other errors
              if (refreshErr.status !== 400 && refreshErr.status !== 500) {
                console.error('Error:', refreshErr);
                dataService.ShowNotification('error', '' , `Error: ${refreshErr.message || 'An error occurred'}`);
              }
              return throwError(() => refreshErr);
          }),
        );
      } else {
        return throwError(() => err);
      }
    }),
  );
};
