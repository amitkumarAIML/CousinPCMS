import { http } from '../auth/HttpClient';
import { DepartmentResponse } from '../models/departmentModel';

export const getDepartments = async (): Promise<DepartmentResponse> => {
  const response = await http.get<DepartmentResponse>('Department/GetAllDepartment');
  return response;
};
