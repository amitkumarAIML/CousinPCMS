import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AttributeModel, AttributeSetModel } from '../../../shared/models/attributeModel';
import { HomeService } from '../home.service';
import { error } from 'jquery';
import { DataService } from '../../../shared/services/data.service';
import { CategoryService } from '../../category/category.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subscription } from 'rxjs/internal/Subscription';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'cousins-category-attribute',
  imports: [NzButtonModule, NzInputModule, NzFormModule, ReactiveFormsModule, FormsModule, CommonModule,
    NzTableModule,
    NzCheckboxModule,
    NzSpinModule,
    NzIconModule,
    NzListModule,
    NzModalModule,
    NzSelectModule,
    NzPopconfirmModule
  ],
  templateUrl: './category-attribute.component.html',
  styleUrl: './category-attribute.component.css'
})
export class CategoryAttributeComponent implements OnInit {
  addAttributeSetsForm: FormGroup;
  attributeList: AttributeModel[] = [];
  isAttributeloading: boolean = false;
  isAttributeSetloading: boolean = false
  isloading: boolean = false;
  categoryDetails: any;
  categoryAttriIsVisible: boolean = false;
  currentAttributeSetName: string = '';
  @Input() categoryData: any = {};

  lstAllAttributeSets: AttributeSetModel[] = [];

  constructor(private fb: FormBuilder,
    private homeService: HomeService,
    private dataService: DataService,
  ) {
    this.addAttributeSetsForm = this.fb.group({
      attributeSetName: ['', Validators.required],
      categoryID: [{ value: '', disabled: true }],
      attributeName: ['', Validators.required],
      attributeRequired: [true],
      notImportant: [true],
      listPosition: [0],
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryData'] && this.categoryData) {
  
      if (this.categoryData && this.categoryData.origin) {
        const attributeSetName = `Attribute Set For - ${this.categoryData.origin.title}`;
        this.currentAttributeSetName = attributeSetName;

        this.addAttributeSetsForm.get('attributeSetName')?.setValue(`Attribute Set For - ${this.categoryData.origin.title}`);
        this.addAttributeSetsForm.get('categoryID')?.setValue(this.categoryData.origin.key);
        this.getAttributeSetsByAttributeSetName(attributeSetName);

      } else {
        const setName = this.categoryData.attributeSetName;
        this.currentAttributeSetName = setName;

        this.addAttributeSetsForm.get('attributeSetName')?.disable();
        this.addAttributeSetsForm.get('attributeSetName')?.setValue(`${this.categoryData.attributeSetName}`);
        this.addAttributeSetsForm.get('categoryID')?.setValue(this.categoryData.akiCategoryID);
        this.getAttributeSetsByAttributeSetName(setName);
      }

    }
  }

  ngOnInit(): void {

  }

  // get All Attributes data
  getAllAttributes() {
    this.isAttributeloading = true;
    this.homeService.getAllAttributes().subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.attributeList = response.value;
          if (this.lstAllAttributeSets && this.lstAllAttributeSets.length > 0) {
            const existingIds = this.lstAllAttributeSets.map((attribute: any) => attribute.attributeName);
            this.attributeList = this.attributeList.filter((attributeSets: any) => !existingIds.includes(attributeSets.attributeName));
          }
          this.isAttributeloading = false;
        } else {
          this.dataService.ShowNotification('error', '', 'Failed To Load Data')
          this.isAttributeloading = false;
        }
        this.isAttributeloading = false;
      }
    })
  }

  addAttributeData(data: any) {
    this.categoryAttriIsVisible = true;
    const existingName = this.addAttributeSetsForm.get('attributeSetName')?.value || '';
    const maxListOrder = this.lstAllAttributeSets && this.lstAllAttributeSets.length > 0
      ? Math.max(...this.lstAllAttributeSets.map((attribute: any) => Number(attribute.listPosition) || 0))
      : 0;

    const nextListPosition = maxListOrder + 1;

    if (!data || !data.attributeName) {
      this.dataService.ShowNotification('error', '', 'Attribute name is missing.');
      return;
    }
    this.addAttributeSetsForm.patchValue({
      attributeSetName: existingName.trim(),
      categoryID: this.addAttributeSetsForm.get('categoryID')?.value,
      attributeName: data.attributeName.trim(),
      attributeRequired: true,
      notImportant: true,
      listPosition: nextListPosition,
    });

  }

  deleteAttributeSets(item: any) {
    this.homeService.deleteAttributeSets(item.attributeName, item.attributeSetName).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'AttributeSets deleted successsully');
          this.getAttributeSetsByAttributeSetName(this.currentAttributeSetName);
          this.homeService.triggerReloadAttributes(); 
        } else {
          this.dataService.ShowNotification('error', '', 'AttributeSets not deleted successsully');
        }
      },
    })
  }
  getFormData() {
    return this.addAttributeSetsForm.getRawValue();
  }

  saveAttributeSets(): void {
    const attributeForm = this.addAttributeSetsForm.getRawValue();

    if (this.addAttributeSetsForm.valid) {
      this.homeService.addAttributeSets(attributeForm).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Attribute added successfully');
            this.categoryAttriIsVisible = false
            const newAttributeSetName=this.addAttributeSetsForm.get('attributeSetName')?.value
            this.getAttributeSetsByAttributeSetName(newAttributeSetName);
            this.homeService.triggerReloadAttributes(); 
          } else {
            this.dataService.ShowNotification('error', '', 'Attribute not added successfully');
          }
        }
      })
    } else {
      Object.values(this.addAttributeSetsForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  btnCancel(): void {
    this.categoryAttriIsVisible = false;
  }
  handleOk(): void {
    this.categoryAttriIsVisible = false;
  }
  btnCancel2(): void {
    this.categoryAttriIsVisible = false;
  }
  getAttributeSetsByAttributeSetName(attributeSetName: string) {
    const encodedAttributeSetName = encodeURIComponent(attributeSetName);
    this.isAttributeSetloading = true;
    this.homeService.getAttributeSetsByAttributeSetName(encodedAttributeSetName).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.lstAllAttributeSets = response.value;
          this.isAttributeSetloading = false;
          this.getAllAttributes();
        } else {
          this.dataService.ShowNotification('error', '', 'Failed to load attribute sets');
          this.isAttributeSetloading = false;
        }
      }, error: () => {
        this.isAttributeSetloading = false;
        this.dataService.ShowNotification('error', '', 'Failed to load attribute sets');
      }
    })
  }
  cancel(): void {
    this.dataService.ShowNotification('info', '', 'Delete action cancelled');
  }
}
