import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DepartmentResponse } from '../../../shared/models/departmentModel';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DataService } from '../../../shared/services/data.service';
import { CommodityCode } from '../../../shared/models/commodityCodeModel';
import { layoutDepartment } from '../../../shared/models/layoutTemplateModel';
import { DepartmentService } from '../department.service';

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
  layoutOptions: layoutDepartment[] = [];

  @Input() deptData!: DepartmentResponse;

  constructor(private fb: FormBuilder, private dataService: DataService, private departmentService: DepartmentService) {
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
      akiDepartmentCommodityCode: [''],
      akI_Catalogue_Active: [false],
      akI_Layout_Template: [],
      akI_Color: ['#F7941D'],
      akI_Featured_Prod_BG_Color: ['#FFFF80'],
    });
    
  }

  ngOnInit(): void {
    this.getCommodityCodes();
    this.getLayoutTemplate();
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
      next:(response: CommodityCode[])=> {
        this.commodityCode = response;
      },error(err) {
      },
    })
  }
  onColorChange(event: Event, field: string) {
      const value = (event.target as HTMLInputElement).value;
      this.departmentForm.patchValue({ [field]: value });
  }
      
  onHexChange(event: Event, field: string) {
    let value = (event.target as HTMLInputElement).value;
    if (!value.startsWith('#')) {
        value = '#' + value;
    }
    this.departmentForm.patchValue({ [field]: value });
  }
  
  getLayoutTemplate() {
    this.departmentService.getLayoutTemplateList().subscribe({
      next: (reponse: layoutDepartment[]) => {
          this.layoutOptions = reponse;
      },
      error: (error) => {
        console.error('Error fetching departments:', error);
      }
    });
  } 

}
