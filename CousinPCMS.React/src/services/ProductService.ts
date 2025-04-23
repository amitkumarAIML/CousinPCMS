import { http } from '../auth/HttpClient';
import { layoutProduct, layoutProductResponse } from '../models/layoutTemplateModel';
import { ProductResponse, ProductRequest, AdditionalProductModel, AdditionalProductResponse, AssociatedProductRequestModelForProduct, DeleteAssociatedProductModelForProduct, Product } from '../models/productModel';
import { AdditionalImagesModel, AdditionalImageDeleteRequestModel } from '../models/additionalImagesModel';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue } from '../models/linkMaintenanaceModel';
import { ApiResponse } from '../models/generalModel';

// Update product
export const updateProduct = async (productData: ProductRequest): Promise<ApiResponse<string>> => {
  const response = await http.put<ApiResponse<string>>('Product/UpdateProduct', productData);
  return response;
};

// Get layout template list
export const getLayoutTemplateList = async (): Promise<layoutProduct[]> => {
  const response = await http.get<layoutProductResponse>('Product/GetProductLayouts');
  return response.value;
};

// Delete product
export const deleteProduct = async (productId: number): Promise<ApiResponse<string>> => {
  const response = await http.get<ApiResponse<string>>('Product/DeleteProduct', { params: { productId } });
  return response;
};

// Get product URLs
export const getProductUrls = async (productId: string): Promise<ApiResponse<LinkValue[]>> => {
  const response = await http.get<ApiResponse<LinkValue[]>>('Product/GetProductUrls', { params: { productId } });
  return response;
};

// Get product additional images
export const getProductAdditionalImages = async (productId: string): Promise<ApiResponse<AdditionalImagesModel[]>> => {
  const response = await http.get<ApiResponse<AdditionalImagesModel[]>>('Product/GetProductAdditionalImages', { params: { productId } });
  return response;
};

// Delete product image URL
export const deleteProductImagesUrl = async (productData: AdditionalImageDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/DeleteProductAdditionalImage', productData);
  return response;
};

// Delete product link URL
export const deleteProductLinkUrl = async (productData: LinkDeleteRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/DeleteProductLinkUrl', productData);
  return response;
};

// Save product image URL
export const saveProductImagesUrl = async (productData: AdditionalImagesModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/AddProductAdditionalImage', productData);
  return response;
};

// Save product link URL
export const saveProductLinkUrl = async (productData: LinkRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/AddProductLinkUrls', productData);
  return response;
};

// Get additional product
export const getAdditionalProduct = async (productId: number): Promise<AdditionalProductModel[]> => {
  const response = await http.get<AdditionalProductResponse>('Product/GetAdditionalProduct', { params: { productId } });
  return response.value;
};

// Add associated product
export const addAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModelForProduct): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/AddAssociatedProduct', associatedFormProductData);
  return response;
};

// Update associated product
export const updateAssociatedProduct = async (associatedFormProductData: AssociatedProductRequestModelForProduct): Promise<ApiResponse<string>> => {
  const response = await http.put<ApiResponse<string>>('Product/UpdateAssociatedProduct', associatedFormProductData);
  return response;
};

// Get product by ID
export const getProductById = async (productId: string): Promise<ProductResponse> => {
  const response = await http.get<ProductResponse>('Product/GetProductById', { params: { akiProductID: productId } });
  return response;
};

// Delete associated product
export const deleteAssociatedProduct = async (associatedProductData: DeleteAssociatedProductModelForProduct): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Product/DeleteAssociatedProduct', associatedProductData);
  return response;
};

// Get all products (with pagination and optional productName)
export const getAllProducts = async (pageIndex: number, pageSize: number, productName?: string): Promise<ApiResponse<Product>> => {
  const response = await http.get<ApiResponse<Product>>('Product/GetAllProducts', { params: { pageSize, pageNumber: pageIndex, productName } });
  return response;
};
