import { http } from '../auth/HttpClient';
import { DepartmentResponse } from '../models/departmentModel';
import { ProductResponse } from '../models/productModel';
import { SkuListResponse } from '../models/skusModel';
import { AddAttributeSetRequestModel, AttributeModel, AttributeModelResponse, AttributeSetModel } from '../models/attributeModel';
import { ApiResponse } from '../models/generalModel';
import { categoryResponse } from '../models/additionalCategoryModel';

// Get all departments
export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetAllDepartment');
  return response;
};

// Get categories by department
export const getCategoriesByDepartment = async (departmentId: string): Promise<categoryResponse> => {
  const response = await http.get<categoryResponse>('Category/GetAllCategoryBYDeptId', { params: { deptId: departmentId } });
  return response;
};

// Get product list by category ID
export const getProductListByCategoryId = async (categoryID: string): Promise<ProductResponse> => {
  const response = await http.get<ProductResponse>('Product/GetProductsByCategory', { params: { CategoryID: categoryID } });
  return response;
};

// Get SKUs by product ID
export const getSkuByProductId = async (productID: number): Promise<SkuListResponse> => {
  const response = await http.get<SkuListResponse>('Item/GetAllItemsByProductId', { params: { akiProductID: productID } });
  return response;
};

// Get all attributes
export const getAllAttributes = async (): Promise<AttributeModelResponse> => {
  const response = await http.get<AttributeModelResponse>('Attributes/GetAllAttributes');
  return response;
};

// Get distinct attribute sets by category ID
export const getDistinctAttributeSetsByCategoryId = async (CategoryId: string): Promise<ApiResponse<AttributeSetModel[]>> => {
  const response = await http.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetDistinctAttributeSetsByCategoryId', { params: { CategoryId } });
  return response;
};

// Delete attribute sets
export const deleteAttributeSets = async (attributeName: string, attributeSetName: string): Promise<AttributeModel> => {
  const response = await http.get<AttributeModel>('Attributes/DeleteAttributeSets', { params: { attributeName, attributeSetName } });
  return response;
};

// Add attribute sets
export const addAttributeSets = async (attributesData: AddAttributeSetRequestModel): Promise<void> => {
  await http.post('Attributes/AddAttributeSets', attributesData);
};

// Get attribute sets by attribute set name
export const getAttributeSetsByAttributeSetName = async (attributeSetName: string): Promise<ApiResponse<AttributeSetModel[]>> => {
  const response = await http.get<ApiResponse<AttributeSetModel[]>>('Attributes/GetAttributeSetsByAttributeSetName', { params: { attributeSetName } });
  return response;
};