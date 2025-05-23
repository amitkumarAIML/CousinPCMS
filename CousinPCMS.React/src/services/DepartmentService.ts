import {http} from '../auth/HttpClient';
import {DepartmentRequest, DepartmentResponse} from '../models/departmentModel';

export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetAllDepartment');
  return response;
};

export const updateDepartment = async (departmentData: DepartmentRequest): Promise<DepartmentResponse> => {
  const response = await http.post<DepartmentResponse>('Department/UpdateDepartment', departmentData);
  return response;
};

export const addDepartment = async (departmentData: DepartmentRequest): Promise<DepartmentResponse> => {
  const response = await http.post<DepartmentResponse>('Department/AddDepartment', departmentData);
  return response;
};

export const deleteDepartment = async (departmentId: number): Promise<void> => {
  await http.get<void>('Department/DeleteDepartment', {params: {deptId: departmentId}});
};

export const getDepartmentById = async (departmentId: string): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetDepartmentById', {params: {deptId: departmentId}});
  return response;
};
