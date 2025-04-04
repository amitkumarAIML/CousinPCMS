import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { layoutProduct, layoutProductResponse } from '../../shared/models/layoutTemplateModel';
import { ProductRequest } from '../../shared/models/productModel';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpService: HttpService) {}

  updateProduct(productData: ProductRequest): Observable<any> {
    return this.httpService.patch(`Product/UpdateProduct`, productData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  getLayoutTemplateList(): Observable<layoutProduct[]>  {
    return this.httpService.get<layoutProductResponse>('Product/GetProductLayouts').pipe(
      map((response: layoutProductResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  deleteProduct(productId :  number): Observable<any> {
    return this.httpService.get<any>(`Product/DeleteProduct`,{ productId: productId }).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

}