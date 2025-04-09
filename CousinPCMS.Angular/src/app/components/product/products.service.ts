import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { layoutProduct, layoutProductResponse } from '../../shared/models/layoutTemplateModel';
import { AssociatedProductRequestModelForProduct, DeleteAssociatedProductModelForProduct, ProductRequest } from '../../shared/models/productModel';
import { ApiResponse, LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../../shared/models/linkMaintenanaceModel';
import { AdditionalCategoryModel, AdditionalCategoryResponse } from '../../shared/models/additionalCategoryModel';

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

  getProductUrls(productId: any): Observable<any>  {
    return this.httpService.get<any>('Product/GetProductUrls',{ productId: productId }).pipe(
      map((response: any) => response),
      catchError(error => throwError(() => error))
    );
  }

  getGetProductAdditionalImages(productId: number): Observable<any[]>  {
    return this.httpService.get<any>('Product/GetProductAdditionalImages',{ productId: productId }).pipe(
      map((response: any) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  deleteProductImagesUrl(productData: any): Observable<any> {
    return this.httpService.post(`Product/DeleteProductAdditionalImage`, productData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteProductLinkUrl(productData: LinkDeleteRequestModel): Observable<any> {
    return this.httpService.post(`Product/DeleteProductLinkUrl`, productData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  saveProductImagesUrl(productData: any): Observable<any> {
    return this.httpService.post(`Product/AddProductAdditionalImage`, productData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  saveProductLinkUrl(productData: LinkRequestModel): Observable<any> {
    return this.httpService.post(`Product/AddProductLinkUrls`, productData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  getAdditionalProduct(productId :  number): Observable<AdditionalCategoryModel[]> {
    return this.httpService.get<AdditionalCategoryResponse>(`Product/GetAdditionalProduct`,{ productId: productId }).pipe(
      map(response => response.value),
      catchError(error => throwError(() => error))
    );
  }

  addAssociatedProduct(associatedFormProductData: AssociatedProductRequestModelForProduct) {
    return this.httpService.post(`Product/AddAssociatedProduct`, associatedFormProductData);
  }
  updateAssociatedProduct(associatedFormProductData: AssociatedProductRequestModelForProduct) {
    return this.httpService.patch(`Product/UpdateAssociatedProduct`, associatedFormProductData);
  }
  
  deleteAssociatedProduct(associatedProductData: DeleteAssociatedProductModelForProduct) {
    return this.httpService.post(`Product/DeleteAssociatedProduct`, associatedProductData);
  }
}