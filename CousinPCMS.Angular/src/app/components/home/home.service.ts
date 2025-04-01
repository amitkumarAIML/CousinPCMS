import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor(private httpService: HttpService) {}

  private selectedDepartment = new BehaviorSubject<any>(null);
  selectedDepartment$ = this.selectedDepartment.asObservable();

  private selectedCategory = new BehaviorSubject<any>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  setSelectedDepartment(dept: any): void {
    this.selectedDepartment.next(dept);
  }

  setSelectedCategory(category: any): void  {
    this.selectedCategory.next(category);
  }

  getDepartments(): Observable<any> {
    return this.httpService.get<any>('Department/GetAllDepartment').pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  getCategoriesByDepartment(departmentId: string): Observable<any> {
    return this.httpService.get<any>('Category/GetAllCategoryBYDeptId', {
      deptId: `${departmentId}`,
    }).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  getProductListByCategoryId(categoryID: string): Observable<any> {
    return this.httpService.get<any>('Product/GetProductsByCategory', {
      CategoryID: `${categoryID}`,
    }).pipe(
      map(response => response.value),
      catchError(this.handleError)
    );
  }

  getSkuByProductId(productID: string): Observable<any> {
    return this.httpService.get<any>('Item/GetAllItemsByProductId', {
      akiProductID: `${productID}`,
    }).pipe(
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
