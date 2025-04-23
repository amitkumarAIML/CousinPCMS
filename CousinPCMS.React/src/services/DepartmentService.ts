import { http } from '../auth/HttpClient';
import { DepartmentRequest, DepartmentResponse } from '../models/departmentModel';
import { layoutDepartment, layoutDepartmentResponse } from '../models/layoutTemplateModel';

// Get all departments
export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetAllDepartment');
  return response;
};

// Call the PUT API to update department
export const updateDepartment = async (departmentData: DepartmentRequest): Promise<DepartmentResponse> => {
  const response = await http.put<DepartmentResponse>('Department/UpdateDepartment', departmentData);
  return response;
};

// Get layout template list
export const getLayoutTemplateList = async (): Promise<layoutDepartment[]> => {
  const response = await http.get<layoutDepartmentResponse>('Department/GetDepartmentLayouts');
  return response.value;
};

// Delete department
export const deleteDepartment = async (departmentId: number): Promise<void> => {
  await http.get<void>('Department/DeleteDepartment', { params: { deptId: departmentId } });
};

// Get department by ID
export const getDepartmentById = async (departmentId: string): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetDepartmentById', { params: { deptId: departmentId } });
  return response;
};

