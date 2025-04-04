import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 constructor(private httpService: HttpService) {}
  
 getAdditionalCategory(categoryId:string): Observable<any> {
  return this.httpService.get<any>('Category/GetAdditionalCategory', {
    categoryId: `${categoryId}`,
  }).pipe(
    map(response=>response.value),
    catchError(this.handleError)
   ) 
  }

  deleteCategory(categoryId:string): Observable<any> {
    return this.httpService.get<any>('Category/DeleteCategory', {
      categoryId: `${categoryId}`,
    }).pipe(
      map(response=>response.value),
      catchError(this.handleError)
     ) 
    }

  getCategoryLayouts(): Observable<any> {
    return this.httpService.get<any>('Category/GetCategoryLayouts').pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  getAllProducts(): Observable<any> {
    return this.httpService.get<any>('Product/GetAllProducts').pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

   // Call the PATCH API to update category
   updateCategory(categoryData: any) {
    return this.httpService.patch(`Category/UpdateCategory`, categoryData);
  }
  addAssociatedProduct(associatedFormProductData: any) {
    return this.httpService.post(`Category/AddAssociatedProduct`, associatedFormProductData);
  }
  updateAssociatedProduct(associatedFormProductData: any) {
    return this.httpService.patch(`Category/UpdateAssociatedProduct`, associatedFormProductData);
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
