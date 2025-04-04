import { Component, Input, SimpleChanges } from '@angular/core';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DepartmentResponse } from '../../../shared/models/departmentModel';
import { DataService } from '../../../shared/services/data.service';
import { DepartmentService } from '../department.service';
import { layoutDepartment, layoutDepartmentResponse } from '../../../shared/models/layoutTemplateModel';

@Component({
  selector: 'cousins-catalogue-options',
  imports: [  
     NzFormModule,
     ReactiveFormsModule,
     NzCheckboxModule, // ✅ Import Checkbox
     NzInputModule, // ✅ Import Input
     NzSelectModule
  ],
  templateUrl: './catalogue-options.component.html',
  styleUrl: './catalogue-options.component.css'
})
export class CatalogueOptionsComponent {
  catalogueForm: FormGroup;
  layoutOptions: layoutDepartment[] = [];
  @Input() deptData!: DepartmentResponse;

    constructor(private fb: FormBuilder,
          private departmentService: DepartmentService, 
          private dataService : DataService) {
          this.catalogueForm = this.fb.group({
            akI_Catalogue_Active: [false],
            akI_Layout_Template: [],
            akI_Color: ['#F7941D'],
            akI_Featured_Prod_BG_Color: ['#FFFF80'],
          });
    }
    getFormData() {
      return this.catalogueForm.value;
    }

    ngOnInit() {
      this.getLayoutTemplate();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['deptData']) {
        if (this.deptData) {
          this.catalogueForm.patchValue(this.deptData);
        }
      }
    }

    onColorChange(event: Event, field: string) {
      const value = (event.target as HTMLInputElement).value;
      this.catalogueForm.patchValue({ [field]: value });
    }
    
    onHexChange(event: Event, field: string) {
      let value = (event.target as HTMLInputElement).value;
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      this.catalogueForm.patchValue({ [field]: value });
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
