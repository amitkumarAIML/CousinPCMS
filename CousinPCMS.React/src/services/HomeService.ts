import {http} from '../auth/HttpClient';
import {DepartmentResponse} from '../models/departmentModel';
import {ProductRequestModelForProductOrderList, ProductResponse, UpdateProductToCategoryRequest} from '../models/productModel';
import {SkuListResponse, SKusRequestModelForProductOrderList} from '../models/skusModel';
import {AddAttributeSetRequestModel, AttributeModel, AttributeModelResponse, AttributeSetModel} from '../models/attributeModel';
import {ApiResponse} from '../models/generalModel';
import { CategoryModel } from '../models/categoryModel';

export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetAllDepartment');
  return response;
};

export const getCategoriesByDepartment = async (departmentId: string): Promise<ApiResponse<CategoryModel>> => {
  const response = await http.get<ApiResponse<CategoryModel>>('Category/GetAllCategoryBYDeptId', {params: {deptId: departmentId}});
  return response;
};

export const getProductListByCategoryId = async (categoryID: string): Promise<ProductResponse> => {
  const response = await http.get<ProductResponse>('Product/GetProductsByCategory', {params: {CategoryID: categoryID}});
  return response;
};

export const getSkuByProductId = async (productID: number): Promise<SkuListResponse> => {
  const response = await http.get<SkuListResponse>('Item/GetAllItemsByProductId', {params: {akiProductID: productID}});
  return response;
};

export const getAllAttributes = async (): Promise<AttributeModelResponse> => {
  const response = await http.get<AttributeModelResponse>('Attributes/GetAllAttributes');
  return response;
};

export const getDistinctAttributeSetsByCategoryId = async (CategoryId: string): Promise<ApiResponse<AttributeSetModel[]>> => {
  const response = await http.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetDistinctAttributeSetsByCategoryId', {params: {CategoryId}});
  return response;
};

export const deleteAttributeSets = async (attributeName: string, attributeSetName: string): Promise<AttributeModel> => {
  const response = await http.get<AttributeModel>('Attributes/DeleteAttributeSets', {params: {attributeName, attributeSetName}});
  return response;
};

export const addAttributeSets = async (attributesData: AddAttributeSetRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>('Attributes/AddAttributeSets', attributesData);
  return response;
};

export const getAttributeSetsByAttributeSetName = async (attributeSetName: string): Promise<ApiResponse<AttributeSetModel[]>> => {
  const response = await http.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetAttributeSetsByAttributeSetName', {params: {attributeSetName}});
  return response;
};

export const updateAttributeSets1 = async (attributesData: AddAttributeSetRequestModel): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>(`Attributes/UpdateAttributeSets`, attributesData);
  return response;
};

export const updateProductListOrderForHomeScreen = async (data: ProductRequestModelForProductOrderList): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>(`Product/UpdateProductListOrderForHomeScreen`, data);
  return response;
};

export const updateSkuListOrderForHomeScreen = async (data: SKusRequestModelForProductOrderList): Promise<ApiResponse<string>> => {
  const response = await http.post<ApiResponse<string>>(`Skus/UpdateSkuListOrderForHomeScreen`, data);
  return response;
}

export const linkProductToCategory = async (data: UpdateProductToCategoryRequest): Promise<ApiResponse<string>> => {
   const response = await http.post<ApiResponse<string>>(`Product/DragDropProductToCategory`, data);
   return response;
};
