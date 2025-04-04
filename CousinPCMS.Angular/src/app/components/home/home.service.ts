import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { Department, DepartmentResponse } from '../../shared/models/departmentModel';
import { Product, ProductResponse } from '../../shared/models/productModel';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor(private httpService: HttpService) {}

  private selectedDepartment = new BehaviorSubject<any>(null);
  selectedDepartment$ = this.selectedDepartment.asObservable();

  private selectedCategory = new BehaviorSubject<any>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  private selectedProduct = new BehaviorSubject<any>(null);
  selectedProduct$ = this.selectedProduct.asObservable();

  private selectedSkU = new BehaviorSubject<any>(null);
  selectedSkU$ = this.selectedSkU.asObservable();

  setSelectedDepartment(dept: any): void {
    this.selectedDepartment.next(dept);
  }

  setSelectedCategory(category: any): void  {
    this.selectedCategory.next(category);
  }

  setSelectedProduct(product: any): void  {
    this.selectedProduct.next(product);
  }

  setSelectedSkU(sku: any): void  {
    this.selectedSkU.next(sku);
  }

  getDepartments(): Observable<Department[]> {
    return this.httpService.get<DepartmentResponse>('Department/GetAllDepartment').pipe(
      map((response: DepartmentResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getCategoriesByDepartment(departmentId: string): Observable<any> {
    return this.httpService.get<any>('Category/GetAllCategoryBYDeptId', {
      deptId: `${departmentId}`,
    }).pipe(
      map(response => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getProductListByCategoryId(categoryID: string): Observable<Product[]> {
    return this.httpService.get<ProductResponse>('Product/GetProductsByCategory', {
      CategoryID: `${categoryID}`,
    }).pipe(
      map((response: ProductResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getSkuByProductId(productID: number): Observable<any> {
    return this.httpService.get<any>('Item/GetAllItemsByProductId', {
      akiProductID: `${productID}`,
    }).pipe(
      map(response => response.value),
      catchError(error => throwError(() => error))
    );
  }
}
