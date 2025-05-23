import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { Department, DepartmentResponse } from '../../../shared/models/departmentModel';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DataService } from '../../../shared/services/data.service';
import { CommodityCode } from '../../../shared/models/commodityCodeModel';
import { layoutDepartment } from '../../../shared/models/layoutTemplateModel';
import { DepartmentService } from '../department.service';
import { DepartmentCharLimit } from '../../../shared/char.constant';

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

  @Input() deptData!: Department;
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  charLimit = DepartmentCharLimit;

  constructor(private fb: FormBuilder, private dataService: DataService, private departmentService: DepartmentService) {
    this.departmentForm = this.fb.group({
      akiDepartmentID: [{ value: '' , disabled: true }, [Validators.required]],
      akiDepartmentName: ['',  [Validators.required]],
      akiDepartmentListOrder: ['',  [Validators.required]],
      akiDepartmentWebActive: [false],
      akiDeptPromptUserifblank: [false],
      akiDepartmentDescText: [''],
      akiDepartmentImageURL: ['',], //[Validators.pattern(/https?:\/\/(www\.)?[\w-]+(\.[\w-]+)+([\/\w-]*)*(\?[\/\w-]*)?$/)]
      akiDepartmentImageHeight: [],
      akiDepartmentImageWidth: [],
      akiDepartmentKeyWords: [''],
      akiDepartmentCommodityCode: [''],
      akiDepartmentIsActive: [true],
      akiLayoutTemplate: [''],
      akiColor: ['#F7941D'],
      akiFeaturedProdBGColor: ['#FFFF80'],
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
      if (this.isValidHex(value)) {
        this.departmentForm.patchValue({ [field]: value });
      } else {
        this.departmentForm.patchValue({ [field]: '#000000' }); // fallback default
      }
  }
      
  onHexChange(event: Event, field: string) {
    let value = (event.target as HTMLInputElement).value;
    if (!value.startsWith('#')) {
        value = '#' + value;
    }
     // Validate and update form
    if (this.isValidHex(value)) {
      this.departmentForm.patchValue({ [field]: value });
    } else {
      this.departmentForm.patchValue({ [field]: '#000000' }); // fallback default
    }
    
  }
  
  // ✅ Utility for hex validation
  isValidHex(value: string): boolean {
    return /^#([0-9A-Fa-f]{6})$/.test(value);
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

  onFileSelected(event: NzUploadChangeParam) {
    const file = event.file?.originFileObj;
       if (file) {
        this.selectedFileName = file.name;
        // Show Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
      };
      this.departmentForm.get('akiDepartmentImageURL')?.setValue( this.selectedFileName); // Set it immediately
  
      reader.readAsDataURL(file);

      if (event.file.status === 'uploading') {
        this.dataService.ShowNotification('success','','file uploaded successfully');
      }
      
    }
  }
 
}
