import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DepartmentResponse } from '../../../shared/models/departmentModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cousins-department-info',
  imports: [
         CommonModule,
         ReactiveFormsModule,
         NzFormModule,
         NzCheckboxModule, // ✅ Import Checkbox
         NzInputModule, // ✅ Import Input
         NzButtonModule,
         NzUploadModule
  ],
  templateUrl: './department-info.component.html',
  styleUrl: './department-info.component.css'
})
export class DepartmentInfoComponent {

  departmentForm: FormGroup;
  @Input() deptData!: DepartmentResponse;

  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      akiDepartmentID: [{ value: '' , disabled: true }, [Validators.required]],
      akiDepartmentName: ['',  [Validators.required]],
      akiDepartmentListOrder: ['',  [Validators.required]],
      akiDepartmentWebActive: [false],
      akI_DeptPromptUserIfBlank: [false],
      akiDepartmentDescText: [''],
      akiDepartmentImageURL: ['',], //[Validators.pattern(/https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([\/\w-]*)*(\?[\/\w-]*)?$/)]
      akiDepartmentImageHeight: [''],
      akiDepartmentImageWidth: [''],
      akiDepartmentKeyWords: [''],
      akiDepartmentCommodityCode: ['']
    });
    
  }

  getFormData() {
    return this.departmentForm.getRawValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['deptData']) {
      if (this.deptData) {
        this.departmentForm.patchValue(this.deptData);
      }
    }
  }

}
