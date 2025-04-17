import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzTableModule} from 'ng-zorro-antd/table';
import {DataService} from '../../../shared/services/data.service';
import {AttributesService} from '../attributes.service';
import {ApiResponse} from '../../../shared/models/generalModel';
import {ItemModel} from '../../../shared/models/itemModel';
import {AttributeRequestModel, AttributeValueModel, AttributeValuesRequestModel} from '../../../shared/models/attributesModel';
import {NzIconModule} from 'ng-zorro-antd/icon';
import { AttributeModel } from '../../../shared/models/attributeModel';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'cousins-attributes-details',
  imports: [ReactiveFormsModule, NzFormModule,NzButtonModule, NzInputModule, NzSelectModule, NzCheckboxModule, NzTableModule, FormsModule, NzModalModule, NzSpinModule, NzIconModule,NzPopconfirmModule],
  templateUrl: './attributes-details.component.html',
  styleUrl: './attributes-details.component.css',
})
export class AttributesDetailsComponent {

  searchValue: string = '';
  attributesValues: AttributeValueModel[] = [];
  searchType: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  loadingProduct: boolean = false;
  deleteLoading: boolean = false;
  attributesForm: FormGroup;
  attributesValuesForm: FormGroup;
  addNewAttributeValueModal: boolean = false;

  filteredData: AttributeValueModel[] = [];
  isEdit: boolean = false;
  attributeName: string = '';
  newValueBtnDisable: boolean = true;

  constructor(private fb: FormBuilder, private dataService: DataService, private readonly router: Router, private attributeService: AttributesService) {
    this.attributesForm = this.fb.group({
      attributeName: ['', [Validators.required]],
      attributeDescription: [''],
      searchType: ['', [Validators.required]],
      showAsCategory: [true],
    });
    this.attributesValuesForm = this.fb.group({
      attributeValue: ['', Validators.required],
      attributeName: [{value: '', disabled: true}, Validators.required],
      // attributeGroupId   : [''],
      alternateValues: [''],
      newAlternateValue: [''],
    });
  }

  ngOnInit() {
    this.getAllSearchType();
    // this.getAllAtrributevalues();
    this.attributeName = sessionStorage.getItem('attributeName') || '';
    if (this.attributeName != '') {
      this.isEdit = true;
      this.newValueBtnDisable = false;
      this.getAttributeByAttributeName();
      this.getAttributeValuesByAttributesName();
      this.attributesForm.get('attributeName')?.disable();
    }
  }

  cancel() {
    this.isEdit = false;
    sessionStorage.removeItem('attributeName');
    this.router.navigate(['/attributes']);
  }
  showAddAttributesModal(): void {
    this.attributesValuesForm.reset();
    this.attributesValuesForm.get('attributeName')?.patchValue(this.attributesForm.getRawValue().attributeName);
    if (!this.attributesValuesForm.get('attributeName')?.value) {
      this.dataService.ShowNotification('error', '', 'Please Add Attributes Name First.');
      return;
    }
    this.addNewAttributeValueModal = true;
  }

  handleCancel(): void {
    this.addNewAttributeValueModal = false;
    this.attributesValuesForm.reset();
  }

  getAllSearchType() {
    this.attributeService.getAttributeSearchTypes().subscribe({
      next: (response: ApiResponse<ItemModel[]>) => {
        if (response.isSuccess) {
          this.searchType = response.value;
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getAllAtrributevalues() {
    this.attributeService.getAttributeValues().subscribe({
      next: (response: ApiResponse<AttributeValueModel[]>) => {
        if (response.isSuccess) {
          this.attributesValues = response.value;
          this.attributesValues.forEach((data: any, index: number) => {
            data['id'] = ++index;
        });
          this.filteredData = [...this.attributesValues];
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  addAttributes() {
    this.attributesForm.markAllAsTouched();

    if (!this.attributesForm.valid) {
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return;
    }

    const data: AttributeRequestModel = this.dataService.cleanEmptyNullToString(this.attributesForm.getRawValue());

    this.btnLoading = true;
    this.attributeService.addAttributes(data).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Attribute Details Added Successfully');
          // this.isEdit = false;
          this.newValueBtnDisable = false;
          this.attributesForm.get('attributeName')?.disable();
          sessionStorage.setItem('attributeName', this.attributesForm.getRawValue().attributeName);
          this.attributeName = this.attributesForm.getRawValue().attributeName;
        } else {
          const firstSentence = response.value.split('.')[0];
          let msg = firstSentence.replace(/^Attribute:\s*/i, '').trim();
          if (!msg || !msg.includes('Attribute:')) {
            msg = 'Something went wrong.';
          }
          this.dataService.ShowNotification('error', '', msg);
        }
        this.btnLoading = false;
      },
      error: (err) => {
        this.btnLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

  updateAttributes() {
    this.attributesForm.markAllAsTouched();

    if (!this.attributesForm.valid) {
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return;
    }

    const data: AttributeRequestModel = this.dataService.cleanEmptyNullToString(this.attributesForm.getRawValue());

    this.btnLoading = true;
    this.attributeService.updateAttributes(data).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Attribute Details Updated Successfully');
        } else {
          const firstSentence = response.value.split('.')[0];
          let msg = firstSentence.replace(/^Attribute:\s*/i, '').trim();
          if (!msg) {
            msg = 'Something went wrong.';
          }
          this.dataService.ShowNotification('error', '', msg);
        }
        this.btnLoading = false;
      },
      error: (err) => {
        this.btnLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

  addAttributesValues() {
    this.attributesValuesForm.markAllAsTouched();

    if (!this.attributesValuesForm.valid) {
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return;
    }
    const data: AttributeValuesRequestModel = this.dataService.cleanEmptyNullToString(this.attributesValuesForm.getRawValue());

    this.btnLoading = true;
    this.attributeService.addAttributesValues(data).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Attribute were added successfully! You are now ready to add new Attributes Values.');
          this.getAttributeValuesByAttributesName();
          this.addNewAttributeValueModal = false;
        } else {
          this.dataService.ShowNotification('error', '', 'Attribute Values Failed To Add');
        }
        this.btnLoading = false;
      },
      error: (err) => {
        this.btnLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

  deleteAttributeValues(data: AttributeValueModel) {
    this.attributeService.deleteAttributesValues(data.attributeName, data.attributeValue).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Attributes Value Successfully Deleted');
          this.filteredData = this.filteredData.filter(d => d.id !== data.id);
        } else {
          this.dataService.ShowNotification('error', '', 'Attributes Value Failed To Deleted');
        }
      },
      error: (err) => {
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

  onSearch() {
    const searchText = this.searchValue?.toLowerCase().replace(/\s/g, '') || '';
  
    if (!searchText) {
      this.filteredData = [...this.attributesValues];
      return;
    }
  
    this.filteredData = this.attributesValues.filter(item => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';
      
      return  normalize(item.attributeName).includes(searchText)||
              normalize(item.attributeValue).includes(searchText)
    }); 
  }
  
  clearSearchText(): void {
    this.searchValue = '';
    this.filteredData = [...this.attributesValues];
   
  }

  getAttributeByAttributeName() {
    this.attributeService.getAttributeByAttributesName(this.attributeName).subscribe({
      next: (response: ApiResponse<AttributeModel[]>) => {
        if (response.isSuccess) {
          this.attributesForm.patchValue(response.value[0])
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getAttributeValuesByAttributesName() {
    this.attributeService.getAttributeValuesByAttributesName(this.attributeName).subscribe({
      next: (response: ApiResponse<AttributeValueModel[]>) => {
        if (response.isSuccess) {
          this.attributesValues = response.value;
          if ( this.attributesValues != null) {
            this.attributesValues.forEach((data: any, index: number) => {
              data['id'] = ++index;
            });
            this.filteredData = [...this.attributesValues];
          }
        
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }
  btnCancel(): void {
    this.dataService.ShowNotification('info', '', 'Delete action cancelled');
  }
  
}
