import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DepartmentInfoComponent } from './department-info/department-info.component';
import { HomeService } from '../home/home.service';
import { DepartmentResponse, DepartmentUpdateResponse } from '../../shared/models/departmentModel';
import { Subscription } from 'rxjs';
import { DepartmentService } from './department.service';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'cousins-departments',
  imports: [
    NzTabsModule,  // ✅ Import Tabs
    NzButtonModule,
    DepartmentInfoComponent,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent  {
  activeTab: number = 0; // Default tab
  departmentData!: DepartmentResponse;

  departmentForm!: FormGroup;
  catalogForm!: FormGroup;
  loading: boolean = false;
  deleteLoading: boolean = false;

  private departmentSubscription!: Subscription;

  @ViewChild(DepartmentInfoComponent) departmentInfoComp!: DepartmentInfoComponent;

  constructor(private homeService: HomeService, private departmentService: DepartmentService, 
      private dataService : DataService, private readonly router: Router) {
  }

  ngOnInit(): void {
    this.departmentSubscription = this.homeService.selectedDepartment$.subscribe(department => {
      if (department) {
        this.departmentData = department[0];
      }
    });
  }

  cancle() {
    this.router.navigate(['/home']);
  }
 
  saveDetails () {
    // Mark all form controls as touched to trigger validation errors
    this.departmentInfoComp.departmentForm.markAllAsTouched();

    // Check if both forms are valid
    if (!this.departmentInfoComp.departmentForm.valid) {
      // If any form is invalid, display error message
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return; // Stop the save process
    }

    // Get data from both components (if forms are valid)
    const departmentData = this.departmentInfoComp.getFormData();

    this.loading = true;
    this.departmentService.updateDepartment(departmentData).subscribe({
      next: (response: DepartmentUpdateResponse) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Department Details Updated Successfully');
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', 'Department Details Failed Updated');
        }        
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
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
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', 'Department Details Failed Deleted');
        }
        this.deleteLoading = false;
      },
      error: (err) => {
        this.deleteLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      }
    });

  }

  ngOnDestroy() {
    if (this.departmentSubscription) {
      this.departmentSubscription.unsubscribe();
    }
  }
    
}
