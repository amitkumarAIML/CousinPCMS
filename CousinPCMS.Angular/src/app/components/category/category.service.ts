import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdditionalCategoryModel, AdditionalCategoryResponse, AssociatedProductRequestModel, categorylayout, categorylayoutResponse, DeleteAssociatedProductModel, UpdateCategoryModel } from '../../shared/models/additionalCategoryModel';
import { Product, ProductResponse } from '../../shared/models/productModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../../shared/models/linkMaintenanaceModel';
import { AdditionalImageDeleteRequestModel, AdditionalImagesModel } from '../../shared/models/additionalImagesModel';
import { ApiResponse } from '../../shared/models/generalModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

 constructor(private httpService: HttpService) {}
  
 getAdditionalCategory(categoryId:string): Observable<AdditionalCategoryModel[]> {
  return this.httpService.get<AdditionalCategoryResponse>('Category/GetAdditionalCategory', {
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
      map(response=>response),
      catchError(this.handleError)
     ) 
    }

  getCategoryLayouts(): Observable<categorylayout[]> {
    return this.httpService.get<categorylayoutResponse>('Category/GetCategoryLayouts').pipe(
      map((response:categorylayoutResponse )=> response.value),
      catchError(this.handleError)
    );
  }

 

   // Call the PATCH API to update category
   updateCategory(categoryData:UpdateCategoryModel) {
    return this.httpService.patch(`Category/UpdateCategory`, categoryData);
  }
  addAssociatedProduct(associatedFormProductData: AssociatedProductRequestModel) {
    return this.httpService.post(`Category/AddAssociatedProduct`, associatedFormProductData);
  }
  updateAssociatedProduct(associatedFormProductData: AssociatedProductRequestModel) {
    return this.httpService.patch(`Category/UpdateAssociatedProduct`, associatedFormProductData);
  }
  deleteAssocatedProduct(deleteAssocatedProduct:DeleteAssociatedProductModel) {
    return this.httpService.post(`Category/DeleteAssociatedProduct`, deleteAssocatedProduct);
  }


  getCategoryUrls(CategoryId: any): Observable<ApiResponse<LinkValue[]>> {
    return this.httpService.get<ApiResponse<LinkValue[]>>('Category/GetCategoryUrls',{ CategoryId: CategoryId }).pipe(
      map((response: ApiResponse<LinkValue[]>) => response),
      catchError(error => throwError(() => error))
    );
  }

  getGetCategoryAdditionalImages(CategoryId: any): Observable<ApiResponse<AdditionalImagesModel[]>>  {
    return this.httpService.get<ApiResponse<AdditionalImagesModel[]>>('Category/GetCategoryAdditionalImages',{ CategoryId: CategoryId }).pipe(
      map((response: ApiResponse<AdditionalImagesModel[]>) => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteCategoryImagesUrl(CategoryData: AdditionalImageDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Category/DeleteCategoryAdditionalImage`, CategoryData).pipe(
      map((response: ApiResponse<string>)  => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteCategoryLinkUrl(CategoryData: LinkDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Category/DeleteCategoryLinkUrl`, CategoryData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  saveCategoryImagesUrl(CategoryData: AdditionalImagesModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Category/AddCategoryAdditionalImage`, CategoryData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  saveCategoryLinkUrl(CategoryData: LinkRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Category/AddCategoryLinkUrls`, CategoryData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError(error => throwError(() => error))
    );
  }

  getCategoryById(categoryId: string): Observable<any> {
    return this.httpService.get<any>('Category/GetCategoryById',{ categoryId: categoryId }).pipe(
      map((response: any) => response),
      catchError(error => throwError(() => error))
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
