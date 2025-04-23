import httpClient from '../auth/HttpClient';
import {DepartmentResponse} from '../models/departmentModel';

export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await httpClient.get<DepartmentResponse>(import.meta.env.VITE_BASE_URL + 'Department/GetAllDepartment');
  return response.data;
};
