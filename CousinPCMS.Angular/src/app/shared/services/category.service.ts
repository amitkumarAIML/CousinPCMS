import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from './http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 constructor(private httpService: HttpService) {}
  
 GetAdditionalCategory(categoryId:string): Observable<any> {
  return this.httpService.get<any>('Category/GetAdditionalCategory', {
    categoryId: `${categoryId}`,
  }).pipe(
    map(response=>response.value),
    catchError(this.handleError)
   ) 
  }

  DeleteCategory(categoryId:string): Observable<any> {
    return this.httpService.get<any>('Category/DeleteCategory', {
      categoryId: `${categoryId}`,
    }).pipe(
      map(response=>response.value),
      catchError(this.handleError)
     ) 
    }

  GetCountryOrigin(): Observable<any> {
    return this.httpService.get<any>('Account/GetCountryOrigin').pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  GetCommodityCodes(): Observable<any> {
    return this.httpService.get<any>('Account/GetCommodityCodes').pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'An unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client-side error: ${error.error.message}`;
      } else {
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
      }
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    }
}
