import {http} from '../auth/HttpClient';
import {ItemModelResponse} from '../models/itemModel';
import {CompetitorItem, CompetitorItemResponse} from '../models/competitorModel';
import {ApiResponse} from '../models/generalModel';
import {LinkDeleteRequestModel, LinkRequestModel, LinkValue, UpdateLinkOrderModel} from '../models/linkMaintenanaceModel';
import {AdditionalImageDeleteRequestModel, AdditionalImagesModel, UpdateAdditionalImagesModel} from '../models/additionalImagesModel';
import {LikedSkuModel, RelatedSkuItem, RelatedSkuModel, SKuList, SkuRequestModel, UpdateSKULinkedAttribute} from '../models/skusModel';
import {AttributeModel} from '../models/attributeModel';
import {AttributeValueByName, AttributeValueModel} from '../models/attributesModel';

export const updateSkus = async (skusData: SkuRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/UpdateItemSKU', skusData);
  return response;
};

export const addSkus = async (skusData: SkuRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Item/AddItem', skusData);
  return response;
};


export const deleteSkus = async (itemId: number): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Skus/DeleteItem', {params: {itemno: itemId}});
  return response;
};

export const getCompetitorDetails = async (): Promise<CompetitorItem[]> => {
  const response = await http.get<CompetitorItemResponse>('Item/GetItemCompetitorDetails');
  return response.value;
};

export const getPriceGroupDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPriceGroupDetails');
  return response;
};

export const getPriceBreaksDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPriceBreaksDetails');
  return response;
};

export const getPricingFormulasDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPricingFormulasDetails');
  return response;
};

export const getRelatedSkuItem = async (itemNumber: string): Promise<ApiResponse<RelatedSkuItem[]>> => {
  const response = await http.get<ApiResponse<RelatedSkuItem[]>>('Skus/GetRelatedSkusByItemNumber', {params: {itemNumber}});
  return response;
};

export const getSkuItemById = async (itemNumber: string): Promise<ApiResponse<SKuList[]>> => {
  const response = await http.get<ApiResponse<SKuList[]>>('Item/GetItemsByItemNo', {params: {itemNumber}});
  return response;
};

export const getSkuUrls = async (SkuId: string): Promise<ApiResponse<LinkValue[]>> => {
  const response = await http.get<ApiResponse<LinkValue[]>>('Skus/GetSkuUrls', {params: {skuItemID: SkuId}});
  return response;
};

export const getSkuAdditionalImages = async (SkuId: string): Promise<ApiResponse<AdditionalImagesModel[]>> => {
  const response = await http.get<ApiResponse<AdditionalImagesModel[]>>('Skus/GetSkuAdditionalImages', {params: {skuItemID: SkuId}});
  return response;
};

export const deleteSkuImagesUrl = async (SkuData: AdditionalImageDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/DeleteSkuAdditionalImage', SkuData);
  return response;
};

export const deleteSkuLinkUrl = async (SkuData: LinkDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/DeleteSkuLinkUrl', SkuData);
  return response;
};

export const saveSkuImagesUrl = async (SkuData: AdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/AddSkuAdditionalImage', SkuData);
  return response;
};

export const updateSkuAdditionalImage = async (SkuData: UpdateAdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/UpdateSkuAdditionalImage', SkuData);
  return response;
};

export const updateSkuLinkUrls = async (SkuData: UpdateLinkOrderModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/UpdateSkuLinkUrls', SkuData);
  return response;
};

export const saveSkuLinkUrl = async (SkuData: LinkRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/AddSkuLinkUrls', SkuData);
  return response;
};

export const getSkuAttributesBycategoryId = async (categoryId: string): Promise<ApiResponse<AttributeModel[]>> => {
  const response = await http.get<ApiResponse<AttributeModel[]>>('Skus/GetSkuAttributesBycategoryId', {params: {categoryId}});
  return response;
};

export const getSkuLinkedAttributes = async (skuItemNo: string): Promise<ApiResponse<LikedSkuModel[]>> => {
  const response = await http.get<ApiResponse<LikedSkuModel[]>>('Skus/GetSkuLinkedAttributes', {params: {akiItemNo: skuItemNo}});
  return response;
};

export const getAttributeValuesByListofNames = async (skusData: AttributeValueByName): Promise<ApiResponse<AttributeValueModel[]>> => {
  const response = await http.post<ApiResponse<AttributeValueModel[]>>('Skus/GetAttributeValuesByListofNames', skusData);
  return response;
};

export const addUpdateSKULinkedAttribute = async (skusData: LikedSkuModel): Promise<ApiResponse<LikedSkuModel>> => {
  const response = await http.post<ApiResponse<LikedSkuModel>>('Skus/AddSKULinkedAttribute', skusData);
  return response;
};

export const updateRelatedSkuItemUnavailable = async (skusData: RelatedSkuModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/UpdateRelatedSKUUnavailable', skusData);
  return response;
};

export const updateRelatedSkuItemObsolete = async (skusData: RelatedSkuModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/UpdateRelatedSKUObsolete', skusData);
  return response;
};

export const updateSKULinkedAttribute = async (skusData: UpdateSKULinkedAttribute): Promise<ApiResponse<LikedSkuModel>> => {
  const response = await http.post<ApiResponse<LikedSkuModel>>('Skus/UpdateSKULinkedAttribute', skusData);
  return response;
};

