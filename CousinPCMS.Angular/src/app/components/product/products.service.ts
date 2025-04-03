import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private httpService: HttpService) {}

  updateProduct(productData: any) {
    return this.httpService.patch(`Product/UpdateProduct`, productData);
  }

  getLayoutTemplateList() {
    return this.httpService.get<any>('Product/GetProductLayouts').pipe(
      map(response => response.value),
      catchError(error => error)
    );
  }

  deleteProduct(productId :  number) {
    return this.httpService.get<any>(`Product/DeleteProduct`,{ productId: productId }).pipe(
      map(response => response.value),
      catchError(error => error)
    );
  }


}