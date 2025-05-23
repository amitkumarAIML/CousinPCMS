import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DepartmentInfoComponent } from './department-info/department-info.component';
import { Department, DepartmentResponse, DepartmentUpdateResponse } from '../../shared/models/departmentModel';
import { Subscription } from 'rxjs';
import { DepartmentService } from './department.service';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'cousins-departments',
  imports: [
    NzTabsModule,  // ✅ Import Tabs
    NzButtonModule,
    DepartmentInfoComponent,
    NzSpinModule,
    NzPopconfirmModule,
    NzIconModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent  implements OnInit {
   @Output() eventComplete = new EventEmitter<string>();
  activeTab: number = 0; // Default tab
  departmentData!: Department;

  departmentForm!: FormGroup;
  catalogForm!: FormGroup;
  loading: boolean = false;
  btnLoading: boolean = false;
  deleteLoading: boolean = false;

  private departmentSubscription!: Subscription;

  @ViewChild(DepartmentInfoComponent) departmentInfoComp!: DepartmentInfoComponent;

  constructor(private departmentService: DepartmentService, 
      private dataService : DataService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.getDepartmentData();
  }
  

  cancel() {
    this.router.navigate(['/home']);
    this.eventComplete.emit('cancel');
  }

  getDepartmentData() {
    this.loading = true;
    const deptId = sessionStorage.getItem('departmentId') || '';
    if (deptId) {
      this.departmentService.getDepartmentById(deptId).subscribe({
            next:(response: DepartmentResponse)=> {
              if (response.isSuccess) {
                this.departmentData = response.value[0];
              } else {
                this.dataService.ShowNotification('error', '', 'Failed To Load Data');
              }
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
              // if (err?.error) {
              //   this.dataService.ShowNotification('error', '', err.error.title);
              // } else {
                this.dataService.ShowNotification('error', '', 'Something went wrong');
              // }
            },
      })
    } else {
      this.dataService.ShowNotification('error', '', 'Please select department tree from home page');
    }
  }
 
  saveDetails () {
    // Mark all form controls as touched to trigger validation errors
    this.departmentInfoComp.departmentForm.markAllAsTouched();

    // Check if both forms are valid

    if (!this.departmentInfoComp.departmentForm.valid) {
      // If any form is invalid, display error message
      this.dataService.ShowNotification('error', '', 'Please fill all required fields.');
      return; // Stop the save process
    }

    const departmentData = this.departmentInfoComp.getFormData();
    departmentData.akiDepartmentIsActive = true;

    const cleanedForm = this.dataService.cleanEmptyNullToString(departmentData);
    this.btnLoading = true;
    this.departmentService.updateDepartment(cleanedForm).subscribe({
      next: (response: DepartmentUpdateResponse) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Department Details Updated Successfully');
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', 'Department Details Failed Updated');
        }        
        this.btnLoading = false;
      },
      error: (err: any) => {
        this.btnLoading = false;
        // if (err?.error) {
        //   this.dataService.ShowNotification('error', '', err.error.title);
        // } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        // }
      }
    });
  }

  delete() {
    const departmentData = this.departmentInfoComp.getFormData();
    this.deleteLoading = true;
    this.departmentService.deleteDepartment(departmentData.akiDepartmentID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Department Successfully deleted');
          sessionStorage.clear();
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', 'Department Details Failed Deleted');
        }
        this.deleteLoading = false;
      },
      error: (err) => {
        this.deleteLoading = false;
        // if (err?.error) {
        //   this.dataService.ShowNotification('error', '', err.error.title);
        // } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        // }
      }
    });

  }

  ngOnDestroy() {
    if (this.departmentSubscription) {
      this.departmentSubscription.unsubscribe();
    }
  }
   
}
