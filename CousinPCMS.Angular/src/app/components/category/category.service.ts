import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { addAssociatedProductModel, AdditionalCategoryModel, AdditionalCategoryResponse, categorylayout, categorylayoutResponse, editAssociatedProductModel, UpdateCategoryModel } from '../../shared/models/additionalCategoryModel';
import { Product, ProductResponse } from '../../shared/models/productModel';
import { ApiResponse, LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../../shared/models/linkMaintenanaceModel';

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

  getAllProducts(): Observable<Product[]> {
    return this.httpService.get<ProductResponse>('Product/GetAllProducts').pipe(
      map((response:ProductResponse)=> response.value),
      catchError(this.handleError)
    );
  }

   // Call the PATCH API to update category
   updateCategory(categoryData:UpdateCategoryModel) {
    return this.httpService.patch(`Category/UpdateCategory`, categoryData);
  }
  addAssociatedProduct(associatedFormProductData: addAssociatedProductModel) {
    return this.httpService.post(`Category/AddAssociatedProduct`, associatedFormProductData);
  }
  updateAssociatedProduct(associatedFormProductData: editAssociatedProductModel) {
    return this.httpService.patch(`Category/UpdateAssociatedProduct`, associatedFormProductData);
  }
  deleteAssocatedProduct(deleteAssocatedProduct:any): Observable<any> {
    return this.httpService.post(`Product/DeleteAssocatedProduct`, deleteAssocatedProduct);
  }


  getCategoryUrls(CategoryId: any): Observable<any> {
    return this.httpService.get<any>('Category/GetCategoryUrls',{ CategoryId: CategoryId }).pipe(
      map((response: any) => response),
      catchError(error => throwError(() => error))
    );
  }

  getGetCategoryAdditionalImages(CategoryId: number): Observable<any[]>  {
    return this.httpService.get<any>('Category/GetCategoryAdditionalImages',{ CategoryId: CategoryId }).pipe(
      map((response: any) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  deleteCategoryImagesUrl(CategoryData: any): Observable<any> {
    return this.httpService.post(`Category/DeleteCategoryAdditionalImage`, CategoryData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteCategoryLinkUrl(CategoryData: LinkDeleteRequestModel): Observable<any> {
    return this.httpService.post(`Category/DeleteCategoryLinkUrl`, CategoryData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  saveCategoryImagesUrl(CategoryData: any): Observable<any> {
    return this.httpService.post(`Category/AddCategoryAdditionalImage`, CategoryData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  saveCategoryLinkUrl(CategoryData: LinkRequestModel): Observable<any> {
    return this.httpService.post(`Category/AddCategoryLinkUrls`, CategoryData).pipe(
      map(response => response),
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
