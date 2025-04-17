import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpService} from '../../shared/services/http.service';
import {catchError, map, Observable, throwError} from 'rxjs';
import {layoutSkus, layoutSkusResponse} from '../../shared/models/layoutTemplateModel';
import {ProductRequest} from '../../shared/models/productModel';
import {ItemModelResponse} from '../../shared/models/itemModel';
import {CompetitorItem, CompetitorItemResponse} from '../../shared/models/competitorModel';
import {ApiResponse} from '../../shared/models/generalModel';
import {LinkDeleteRequestModel, LinkRequestModel, LinkValue} from '../../shared/models/linkMaintenanaceModel';
import {AdditionalImageDeleteRequestModel, AdditionalImagesModel} from '../../shared/models/additionalImagesModel';
import { SKuList, SkuListResponse, SkuRequestModel } from '../../shared/models/skusModel';

@Injectable({
  providedIn: 'root',
})
export class SkusService {
  constructor(private httpService: HttpService) {}

  updateSkus(skusData: SkuRequestModel): Observable<ApiResponse<SKuList>> {
    return this.httpService.post<ApiResponse<SKuList>>(`Skus/UpdateItemSKU`, skusData).pipe(
      map((response: ApiResponse<SKuList>) => response),
      catchError((error) => throwError(() => error))
    )
  }

  deleteSkus(itemId: number): Observable<any> {
    return this.httpService.get<any>(`Skus/DeleteItem`, {itemno: itemId}).pipe(
      map((response) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getLayoutTemplateList(): Observable<layoutSkus[]> {
    return this.httpService.get<layoutSkusResponse>('Skus/GetSkusLayouts').pipe(
      map((response: layoutSkusResponse) => response.value),
      catchError((error) => throwError(() => error))
    );
  }

  getCompetitorDetails(): Observable<CompetitorItem[]> {
    return this.httpService.get<CompetitorItemResponse>('Item/GetItemCompetitorDetails').pipe(
      map((response: CompetitorItemResponse) => response.value),
      catchError((error) => throwError(() => error))
    );
  }

  getPriceGroupDetails(): Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPriceGroupDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getPriceBreaksDetails(): Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPriceBreaksDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getPricingFormulasDetails(): Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>('Item/GetItemPricingFormulasDetails').pipe(
      map((response: ItemModelResponse) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getRelatedSkuItem(itemNumber: string): Observable<ItemModelResponse> {
    return this.httpService.get<ItemModelResponse>(`Skus/GetRelatedSkusByItemNumber`, {itemNumber: itemNumber}).pipe(
      map((response: ItemModelResponse) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getSkuItemById(itemNumber: string): Observable<ApiResponse<SKuList[]>> {
    return this.httpService.get<ApiResponse<SKuList[]>>(`Item/GetItemsByItemNo`, {itemNumber: itemNumber}).pipe(
      map((response: ApiResponse<SKuList[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getSkuUrls(SkuId: any): Observable<ApiResponse<LinkValue[]>> {
    return this.httpService.get<ApiResponse<LinkValue[]>>('Skus/GetSkuUrls', {skuItemID: SkuId}).pipe(
      map((response: ApiResponse<LinkValue[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  getSkuAdditionalImages(SkuId: any): Observable<ApiResponse<AdditionalImagesModel[]>> {
    return this.httpService.get<ApiResponse<AdditionalImagesModel[]>>('Skus/GetSkuAdditionalImages', {skuItemID: SkuId}).pipe(
      map((response: ApiResponse<AdditionalImagesModel[]>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  deleteSkuImagesUrl(SkuData: AdditionalImageDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Skus/DeleteSkuAdditionalImage`, SkuData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  deleteSkuLinkUrl(SkuData: LinkDeleteRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Skus/DeleteSkuLinkUrl`, SkuData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  saveSkuImagesUrl(SkuData: AdditionalImagesModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Skus/AddSkuAdditionalImage`, SkuData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => throwError(() => error))
    );
  }

  saveSkuLinkUrl(SkuData: LinkRequestModel): Observable<ApiResponse<string>> {
    return this.httpService.post<ApiResponse<string>>(`Skus/AddSkuLinkUrls`, SkuData).pipe(
      map((response: ApiResponse<string>) => response),
      catchError((error) => throwError(() => error))
    );
  }
}
