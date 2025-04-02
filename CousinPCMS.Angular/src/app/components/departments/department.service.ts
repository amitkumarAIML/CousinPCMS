import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private httpService: HttpService) {}

   // Call the PATCH API to update department
  updateDepartment(departmentData: any) {
    return this.httpService.patch(`Department/UpdateDepartment`, departmentData);
  }

  getLayoutTemplateList() {
    return this.httpService.get<any>('Department/GetDepartmentLayouts').pipe(
      map(response => response.value),
      catchError(error => error)
    );
  }

  deleteDepartment(departmentId :  number) {
    return this.httpService.get<any>(`Department/DeleteDepartment`,{deptId: departmentId}).pipe(
      map(response => response.value),
      catchError(error => error)
    );
  }


}