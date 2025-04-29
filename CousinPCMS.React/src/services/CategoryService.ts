import { http } from '../auth/HttpClient';
import { AdditionalCategoryModel, AdditionalCategoryResponse, AssociatedProductRequestModel, categorylayout, categorylayoutResponse, categoryResponse, DeleteAssociatedProductModel, UpdateCategoryModel } from '../models/additionalCategoryModel';
import { ApiResponse } from '../models/generalModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../models/linkMaintenanaceModel';
import { AdditionalImageDeleteRequestModel, AdditionalImagesModel } from '../models/additionalImagesModel';

// Get additional categories
export const getAdditionalCategory = async (categoryId: string): Promise<AdditionalCategoryModel[]> => {
  const response = await http.get<AdditionalCategoryResponse>('Category/GetAdditionalCategory', { params: { categoryId } });
  return response.value;
};

// Delete category
export const deleteCategory = async (categoryId: string): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Category/DeleteCategory', { params: { categoryId } });
  return response;
};

// Get category layouts
export const getCategoryLayouts = async (): Promise<categorylayout[]> => {
  const response = await http.get<categorylayoutResponse>('Category/GetCategoryLayouts');
  return response.value;
};

// Update category
export const updateCategory = async (categoryData: UpdateCategoryModel): Promise<ApiResponse<string>> => {
  const response = await http.patch<ApiResponse<string>>('Category/UpdateCategory', categoryData);
  return response;
};

// Add associated product
export const addAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddAssociatedProduct', associatedFormProductData);
  return response;
};

// Update associated product
export const updateAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.patch<ApiResponse<string>>('Category/UpdateAssociatedProduct', associatedFormProductData);
  return response;
};

// Delete associated product
export const deleteAssociatedProduct = async (deleteAssocatedProduct: DeleteAssociatedProductModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteAssociatedProduct', deleteAssocatedProduct);
  return response;
};

// Get category URLs
export const getCategoryUrls = async (CategoryId: string): Promise<ApiResponse<LinkValue[]>> => {
  const response = await http.get<ApiResponse<LinkValue[]>>('Category/GetCategoryUrls', { params: { CategoryId } });
  return response;
};

// Get category additional images
export const getCategoryAdditionalImages = async (CategoryId: string): Promise<ApiResponse<AdditionalImagesModel[]>> => {
  const response = await http.get<ApiResponse<AdditionalImagesModel[]>>('Category/GetCategoryAdditionalImages', { params: { CategoryId } });
  return response;
};

// Delete category image URL
export const deleteCategoryImagesUrl = async (CategoryData: AdditionalImageDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteCategoryAdditionalImage', CategoryData);
  return response;
};

// Delete category link URL
export const deleteCategoryLinkUrl = async (CategoryData: LinkDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/DeleteCategoryLinkUrl', CategoryData);
  return response;
};

// Save category image URL
export const saveCategoryImagesUrl = async (CategoryData: AdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddCategoryAdditionalImage', CategoryData);
  return response;
};

// Save category link URL
export const saveCategoryLinkUrl = async (CategoryData: LinkRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Category/AddCategoryLinkUrls', CategoryData);
  return response;
};

// Get category by ID
export const getCategoryById = async (categoryId: string): Promise<ApiResponse<categoryResponse>> => {
  const response = await http.get<ApiResponse<categoryResponse>>('Category/GetCategoryById', { params: { categoryId } });
  return response;
};
