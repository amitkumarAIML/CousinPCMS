import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { layoutProduct, layoutProductResponse } from '../../shared/models/layoutTemplateModel';
import { ProductRequest, ProductResponse } from '../../shared/models/productModel';
import { addAssociatedProductModel, editAssociatedProductModel } from '../../shared/models/additionalCategoryModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../../shared/models/linkMaintenanaceModel';
import { ApiResponse } from '../../shared/models/generalModel';
import { AdditionalImagesModel, AdditionalImageDeleteRequestModel } from '../../shared/models/additionalImagesModel';

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

  getAdditionalProduct(productId :  number): Observable<any> {
    return this.httpService.get<any>(`Product/GetAdditionalProduct`,{ productId: productId }).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  addAssociatedProduct(associatedFormProductData: addAssociatedProductModel) {
    return this.httpService.post(`Product/AddAssociatedProduct`, associatedFormProductData);
  }
  updateAssociatedProduct(associatedFormProductData: editAssociatedProductModel) {
    return this.httpService.patch(`Product/UpdateAssociatedProduct`, associatedFormProductData);
  }

  getProductById(productId: string): Observable<ProductResponse>  {
    return this.httpService.get<ProductResponse>('Product/GetProductById',{ akiProductID: productId }).pipe(
      map((response: ProductResponse) => response),
      catchError(error => throwError(() => error))
    );
  }
}