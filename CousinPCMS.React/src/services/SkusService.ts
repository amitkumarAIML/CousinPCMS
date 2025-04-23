import { http } from '../auth/HttpClient';
import { layoutSkus, layoutSkusResponse } from '../models/layoutTemplateModel';
import { ItemModelResponse } from '../models/itemModel';
import { CompetitorItem, CompetitorItemResponse } from '../models/competitorModel';
import { ApiResponse } from '../models/generalModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../models/linkMaintenanaceModel';
import { AdditionalImageDeleteRequestModel, AdditionalImagesModel } from '../models/additionalImagesModel';
import { LikedSkuModel, SKuList, SkuRequestModel } from '../models/skusModel';
import { AttributeModel } from '../models/attributeModel';
import { AttributeValueByName, AttributeValueModel } from '../models/attributesModel';

// Update SKUs
export const updateSkus = async (skusData: SkuRequestModel): Promise<ApiResponse<SKuList>> => {
  const response = await http.post<ApiResponse<SKuList>>('Skus/UpdateItemSKU', skusData);
  return response;
};

// Delete SKUs
export const deleteSkus = async (itemId: number): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Skus/DeleteItem', { params: { itemno: itemId } });
  return response;
};

// Get layout template list
export const getLayoutTemplateList = async (): Promise<layoutSkus[]> => {
  const response = await http.get<layoutSkusResponse>('Skus/GetSkusLayouts');
  return response.value;
};

// Get competitor details
export const getCompetitorDetails = async (): Promise<CompetitorItem[]> => {
  const response = await http.get<CompetitorItemResponse>('Item/GetItemCompetitorDetails');
  return response.value;
};

// Get price group details
export const getPriceGroupDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPriceGroupDetails');
  return response;
};

// Get price breaks details
export const getPriceBreaksDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPriceBreaksDetails');
  return response;
};

// Get pricing formulas details
export const getPricingFormulasDetails = async (): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Item/GetItemPricingFormulasDetails');
  return response;
};

// Get related SKU item
export const getRelatedSkuItem = async (itemNumber: string): Promise<ItemModelResponse> => {
  const response = await http.get<ItemModelResponse>('Skus/GetRelatedSkusByItemNumber', { params: { itemNumber } });
  return response;
};

// Get SKU item by ID
export const getSkuItemById = async (itemNumber: string): Promise<ApiResponse<SKuList[]>> => {
  const response = await http.get<ApiResponse<SKuList[]>>('Item/GetItemsByItemNo', { params: { itemNumber } });
  return response;
};

// Get SKU URLs
export const getSkuUrls = async (SkuId: string): Promise<ApiResponse<LinkValue[]>> => {
  const response = await http.get<ApiResponse<LinkValue[]>>('Skus/GetSkuUrls', { params: { skuItemID: SkuId } });
  return response;
};

// Get SKU additional images
export const getSkuAdditionalImages = async (SkuId: string): Promise<ApiResponse<AdditionalImagesModel[]>> => {
  const response = await http.get<ApiResponse<AdditionalImagesModel[]>>('Skus/GetSkuAdditionalImages', { params: { skuItemID: SkuId } });
  return response;
};

// Delete SKU image URL
export const deleteSkuImagesUrl = async (SkuData: AdditionalImageDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/DeleteSkuAdditionalImage', SkuData);
  return response;
};

// Delete SKU link URL
export const deleteSkuLinkUrl = async (SkuData: LinkDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/DeleteSkuLinkUrl', SkuData);
  return response;
};

// Save SKU image URL
export const saveSkuImagesUrl = async (SkuData: AdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/AddSkuAdditionalImage', SkuData);
  return response;
};

// Save SKU link URL
export const saveSkuLinkUrl = async (SkuData: LinkRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Skus/AddSkuLinkUrls', SkuData);
  return response;
};

// Get SKU attributes by category ID
export const getSkuAttributesBycategoryId = async (categoryId: string): Promise<ApiResponse<AttributeModel[]>> => {
  const response = await http.get<ApiResponse<AttributeModel[]>>('Skus/GetSkuAttributesBycategoryId', { params: { categoryId } });
  return response;
};

// Get SKU linked attributes
export const getSkuLinkedAttributes = async (skuItemNo: string): Promise<ApiResponse<LikedSkuModel[]>> => {
  const response = await http.get<ApiResponse<LikedSkuModel[]>>('Skus/GetSkuLinkedAttributes', { params: { akiItemNo: skuItemNo } });
  return response;
};

// Get attribute values by list of names
export const getAttributeValuesByListofNames = async (skusData: AttributeValueByName): Promise<ApiResponse<AttributeValueModel[]>> => {
  const response = await http.post<ApiResponse<AttributeValueModel[]>>('Skus/GetAttributeValuesByListofNames', skusData);
  return response;
};

// Add or update SKU linked attribute
export const addUpdateSKULinkedAttribute = async (skusData: LikedSkuModel): Promise<ApiResponse<LikedSkuModel>> => {
  const response = await http.post<ApiResponse<LikedSkuModel>>('Skus/AddUpdateSKULinkedAttribute', skusData);
  return response;
};
