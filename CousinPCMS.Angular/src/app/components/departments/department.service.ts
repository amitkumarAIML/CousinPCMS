import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { DepartmentRequest } from '../../shared/models/departmentModel';
import { layoutDepartment, layoutDepartmentResponse } from '../../shared/models/layoutTemplateModel';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private httpService: HttpService) {}

   // Call the PATCH API to update department
  updateDepartment(departmentData: DepartmentRequest) : Observable<any> {
    return this.httpService.patch<any>(`Department/UpdateDepartment`, departmentData).pipe(
      map(response =>  response),
      catchError(error => throwError(() => error))
    );
  }

  getLayoutTemplateList(): Observable<layoutDepartment[]> {
    return this.httpService.get<layoutDepartmentResponse>('Department/GetDepartmentLayouts').pipe(
      map((response:layoutDepartmentResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  deleteDepartment(departmentId :  number) : Observable<any> {
    return this.httpService.get<any>(`Department/DeleteDepartment`,{deptId: departmentId}).pipe(
      map(response => response.value),
      catchError(error => throwError(() => error))
    );
  }


}