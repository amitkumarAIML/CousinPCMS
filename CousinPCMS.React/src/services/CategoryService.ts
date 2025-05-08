import {http} from '../auth/HttpClient';
import {
  AdditionalCategoryModel,
  AdditionalCategoryResponse,
  AssociatedProductRequestModel,
  categorylayout,
  categorylayoutResponse,
  categoryResponse,
  DeleteAssociatedProductModel,
  UpdateCategoryModel,
} from '../models/additionalCategoryModel';
import {ApiResponse} from '../models/generalModel';
import {LinkDeleteRequestModel, LinkRequestModel, LinkValue, UpdateLinkOrderModel} from '../models/linkMaintenanaceModel';
import {AdditionalImageDeleteRequestModel, AdditionalImagesModel, UpdateAdditionalImagesModel} from '../models/additionalImagesModel';

export const getAdditionalCategory = async (categoryId: string): Promise<AdditionalCategoryModel[]> => {
  const response = await http.get<AdditionalCategoryResponse>('Category/GetAdditionalCategory', {params: {categoryId}});
  return response.value;
};

export const deleteCategory = async (categoryId: string): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Category/DeleteCategory', {params: {categoryId}});
  return response;
};

export const getCategoryLayouts = async (): Promise<categorylayout[]> => {
  const response = await http.get<categorylayoutResponse>('Category/GetCategoryLayouts');
  return response.value;
};

export const updateCategory = async (categoryData: UpdateCategoryModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/UpdateCategory', categoryData);
  return response;
};

export const addCategory = async (categoryData: UpdateCategoryModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddCategory', categoryData);
  return response;
};

export const addAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddAssociatedProduct', associatedFormProductData);
  return response;
};

export const updateAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/UpdateAssociatedProduct', associatedFormProductData);
  return response;
};

export const deleteAssociatedProduct = async (deleteAssocatedProduct: DeleteAssociatedProductModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteAssociatedProduct', deleteAssocatedProduct);
  return response;
};

export const getCategoryUrls = async (CategoryId: string): Promise<ApiResponse<LinkValue[]>> => {
  const response = await http.get<ApiResponse<LinkValue[]>>('Category/GetCategoryUrls', {params: {CategoryId}});
  return response;
};

export const getCategoryAdditionalImages = async (CategoryId: string): Promise<ApiResponse<AdditionalImagesModel[]>> => {
  const response = await http.get<ApiResponse<AdditionalImagesModel[]>>('Category/GetCategoryAdditionalImages', {params: {CategoryId}});
  return response;
};

export const deleteCategoryImagesUrl = async (CategoryData: AdditionalImageDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteCategoryAdditionalImage', CategoryData);
  return response;
};

export const deleteCategoryLinkUrl = async (CategoryData: LinkDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteCategoryLinkUrl', CategoryData);
  return response;
};

export const saveCategoryImagesUrl = async (CategoryData: AdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddCategoryAdditionalImage', CategoryData);
  return response;
};

export const updateCategoryAdditionalImage = async (CategoryData: UpdateAdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/UpdateCategoryAdditionalImage', CategoryData);
  return response;
};

export const saveCategoryLinkUrl = async (CategoryData: LinkRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddCategoryLinkUrls', CategoryData);
  return response;
};

export const updateCategoryLinkUrls = async (CategoryData: UpdateLinkOrderModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/UpdateCategoryLinkUrls', CategoryData);
  return response;
};


export const getCategoryById = async (categoryId: string): Promise<ApiResponse<categoryResponse>> => {
  const response = await http.get<ApiResponse<categoryResponse>>('Category/GetCategoryById', {params: {categoryId}});
  return response;
};
