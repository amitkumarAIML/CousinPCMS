import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, throwError } from 'rxjs';
import { layoutSkus, layoutSkusResponse } from '../../shared/models/layoutTemplateModel';
import { ProductRequest } from '../../shared/models/productModel';
import { ItemModelResponse } from '../../shared/models/itemModel';
import { CompetitorItem, CompetitorItemResponse } from '../../shared/models/competitorModel';

@Injectable({
  providedIn: 'root',
})
export class SkusService {
  constructor(private httpService: HttpService) {}

  updateSkus(skusData: ProductRequest): Observable<any> {
    return this.httpService.post(`Skus/UpdateItemSKU`, skusData).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  deleteSkus(itemId :  number): Observable<any> {
    return this.httpService.get<any>(`Skus/DeleteItem`,{ itemId: itemId }).pipe(
      map(response => response),
      catchError(error => throwError(() => error))
    );
  }

  getLayoutTemplateList(): Observable<layoutSkus[]>  {
    return this.httpService.get<layoutSkusResponse>('Skus/GetSkusLayouts').pipe(
      map((response: layoutSkusResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getCompetitorDetails(): Observable<CompetitorItem[]>{
    return this.httpService.get<CompetitorItemResponse>('Item/GetItemCompetitorDetails').pipe(
      map((response: CompetitorItemResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getPriceGroupDetails() : Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPriceGroupDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError(error => throwError(() => error))
    );
  }

  getPriceBreaksDetails() : Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPriceBreaksDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError(error => throwError(() => error))
    );
  }

  getPricingFormulasDetails() : Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPricingFormulasDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError(error => throwError(() => error))
    );
  }
  
  getRelatedSkuItem(itemNumber: number) : Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>(`Skus/GetRelatedSkusByItemNumber`, {itemNumber: itemNumber}).pipe(
      map((response: ItemModelResponse) => response),
      catchError(error => throwError(() => error))
    );
  }
 

}