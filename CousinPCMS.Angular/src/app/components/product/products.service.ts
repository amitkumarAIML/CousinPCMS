import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { layoutProduct, layoutProductResponse } from '../../shared/models/layoutTemplateModel';
import { AdditionalImagesModel, AdditionalImageDeleteRequestModel } from '../../shared/models/additionalImagesModel';
import { AdditionalProductModel, AdditionalProductResponse, AssociatedProductRequestModelForProduct, DeleteAssociatedProductModelForProduct, ProductRequest } from '../../shared/models/productModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../../shared/models/linkMaintenanaceModel';
import { ApiResponse } from '../../shared/models/generalModel';

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

  getProductUrls(productId: any): Observable<ApiResponse<LinkValue[]>>  {
    return this.httpService.get<ApiResponse<LinkValue[]>>('Product/GetProductUrls',{ productId: productId }).pipe(
      map((response: ApiResponse<LinkValue[]>) => response),
      catchError(error => throwError(() => error))
    );
  }

  getGetProductAdditionalImages(productId: any): Observable<ApiResponse<AdditionalImagesModel[]>>  {
    return this.httpService.get<ApiResponse<AdditionalImagesModel[]>>('Product/GetProductAdditionalImages',{ productId: productId }).pipe(
      map((response: ApiResponse<AdditionalImagesModel[]>) => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteProductImagesUrl(productData: AdditionalImageDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Product/DeleteProductAdditionalImage`, productData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteProductLinkUrl(productData: LinkDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Product/DeleteProductLinkUrl`, productData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  saveProductImagesUrl(productData: AdditionalImagesModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Product/AddProductAdditionalImage`, productData).pipe(
      map((response:ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  saveProductLinkUrl(productData: LinkRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Product/AddProductLinkUrls`, productData).pipe(
      map((response: ApiResponse<string>)=> response),
      catchError(error => throwError(() => error))
    );
  }

  getAdditionalProduct(productId :  number): Observable<AdditionalProductModel[]> {
    return this.httpService.get<AdditionalProductResponse>(`Product/GetAdditionalProduct`,{ productId: productId }).pipe(
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