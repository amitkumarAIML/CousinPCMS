import {Injectable} from '@angular/core';
import {HttpService} from '../../shared/services/http.service';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ItemModel} from '../../shared/models/itemModel';
import {ApiResponse} from '../../shared/models/generalModel';
import { AttributeModel, AttributeRequestModel, AttributeValueModel, AttributeValuesRequestModel } from '../../shared/models/attributesModel';

@Injectable({
  providedIn: 'root',
})
export class AttributesService {
  constructor(private httpService: HttpService) {}

  addAttributes(attributesData: AttributeRequestModel): Observable<ApiResponse<any>> {
    return this.httpService.post<ApiResponse<any>>(`Attributes/AddAttributes`, attributesData).pipe(
      map((response: ApiResponse<any>) => response),
      catchError((error) => throwError(() => error))
    )
  }

  addAttributesValues(attributesData: AttributeValuesRequestModel): Observable<ApiResponse<any>> {
    return this.httpService.post<ApiResponse<any>>(`Attributes/AddAttributesValues`, attributesData).pipe(
      map((response: ApiResponse<any>) => response),
      catchError((error) => throwError(() => error))
    )
  }

  deleteAttributesValues(attributeName: string, attributeValue: string): Observable<any> {
    return this.httpService.get<any>(`Attributes/DeleteAttributeValue`, {attributeName: attributeName, attributeValue: attributeValue}).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error))
    );
  }

  
  deleteAttributes(attributeName: string): Observable<any> {
    return this.httpService.get<any>(`Attributes/DeleteAttribute`, {attributeName: attributeName}).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getAttributesList(): Observable<ApiResponse<AttributeModel[]>> {
    return this.httpService.get<ApiResponse<AttributeModel[]>>('Attributes/GetAllAttributes').pipe(
      map((response: ApiResponse<AttributeModel[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getAttributeSearchTypes(): Observable<ApiResponse<ItemModel[]>> {
    return this.httpService.get<ApiResponse<ItemModel[]>>('Attributes/GetAttributeSearchTypes').pipe(
      map((response: ApiResponse<ItemModel[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getAttributeValues(): Observable<ApiResponse<AttributeValueModel[]>> {
    return this.httpService.get<ApiResponse<AttributeValueModel[]>>('Attributes/GetAllAttributeValues').pipe(
      map((response: ApiResponse<AttributeValueModel[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

 
}
