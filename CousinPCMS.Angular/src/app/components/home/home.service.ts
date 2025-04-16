import {Injectable} from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { DepartmentResponse } from '../../shared/models/departmentModel';
import { ProductResponse } from '../../shared/models/productModel';
import { SkuListResponse } from '../../shared/models/skusModel';
import { AddAttributeSetRequestModel, AttributeModel, AttributeModelResponse, AttributeSetModel, AttributeSetModelResponse } from '../../shared/models/attributeModel';
import { ApiResponse } from '../../shared/models/generalModel';

@Injectable({
  providedIn: 'root',
})
export class HomeService {

  constructor(private httpService: HttpService) {}

  getDepartments(): Observable<DepartmentResponse> {
    return this.httpService.get<DepartmentResponse>('Department/GetAllDepartment').pipe(
      map((response: DepartmentResponse) => response),
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

  getProductListByCategoryId(categoryID: string): Observable<ProductResponse> {
    return this.httpService.get<ProductResponse>('Product/GetProductsByCategory', {
      CategoryID: `${categoryID}`,
    }).pipe(
      map((response: ProductResponse) => response),
      catchError(error => throwError(() => error))
    );
  }

  getSkuByProductId(productID: number): Observable<SkuListResponse> {
    return this.httpService.get<SkuListResponse>('Item/GetAllItemsByProductId', {
      akiProductID: `${productID}`,
    }).pipe(
      map((response: SkuListResponse) => response),
      catchError(error => throwError(() => error))
    );
  }

  getAllAttributes(): Observable<AttributeModel[]> {
    return this.httpService.get<AttributeModelResponse>('Attributes/GetAllAttributes').pipe(
      map((response: any) => response),
      catchError(error => throwError(() => error))
    );
  }
  getDistinctAttributeSetsByCategoryId(CategoryId:string): Observable<ApiResponse<AttributeSetModel[]>> {
    return this.httpService.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetDistinctAttributeSetsByCategoryId',{
      CategoryId: `${CategoryId}`,
    }).pipe(
      map((response:ApiResponse<AttributeSetModel[]>)=>response),
      catchError(error => throwError(() => error))
    );
  }
  deleteAttributeSets(attributeName: string, attributeSetName: string): Observable<AttributeModel> {
    return this.httpService.get<any>('Attributes/DeleteAttributeSets', {
      attributeName: `${attributeName}`, attributeSetName: `${attributeSetName}`,
    }).pipe(
      map((response: any) => response),
      catchError(error => throwError(() => error))
    );
    
  }
  
  addAttributeSets(attributesData:AddAttributeSetRequestModel) {
    return this.httpService.post(`Attributes/AddAttributeSets`, attributesData);
  }

  getAttributeSetsByAttributeSetName(attributeSetName:string): Observable<ApiResponse<AttributeSetModel[]>> {
    return this.httpService.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetAttributeSetsByAttributeSetName',{
      attributeSetName: `${attributeSetName}`,
    }).pipe(
      map((response:ApiResponse<AttributeSetModel[]>)=>response),
      catchError(error => throwError(() => error))
    );
  }
 
}
