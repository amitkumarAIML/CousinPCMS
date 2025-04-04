import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DepartmentResponse } from '../../../shared/models/departmentModel';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../category/category.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'cousins-department-info',
  imports: [
         CommonModule,
         ReactiveFormsModule,
         NzFormModule,
         NzCheckboxModule, // ✅ Import Checkbox
         NzInputModule, // ✅ Import Input
         NzButtonModule,
         NzUploadModule,
         NzSelectModule,
  ],
  templateUrl: './department-info.component.html',
  styleUrl: './department-info.component.css'
})
export class DepartmentInfoComponent {

  departmentForm: FormGroup;
  commodityCode: any[] = [];
  @Input() deptData!: DepartmentResponse;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.departmentForm = this.fb.group({
      akiDepartmentID: [{ value: '' , disabled: true }, [Validators.required]],
      akiDepartmentName: ['',  [Validators.required]],
      akiDepartmentListOrder: ['',  [Validators.required]],
      akiDepartmentWebActive: [false],
      akI_DeptPromptUserIfBlank: [false],
      akiDepartmentDescText: [''],
      akiDepartmentImageURL: ['',], //[Validators.pattern(/https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([\/\w-]*)*(\?[\/\w-]*)?$/)]
      akiDepartmentImageHeight: [],
      akiDepartmentImageWidth: [],
      akiDepartmentKeyWords: [''],
      akiDepartmentCommodityCode: ['']
    });
    
  }

  ngOnInit(): void {
    this.getCommodityCodes();
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

  getCommodityCodes(){
    this.dataService.getCommodityCodes().subscribe({
      next:(response)=> {
        this.commodityCode = response;
      },error(err) {
        console.log(err);        
      },
    })
  }

}
