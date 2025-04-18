import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {AttributesService} from '../attributes.service';
import {DataService} from '../../../shared/services/data.service';
import { AttributeValuesRequestModel } from '../../../shared/models/attributesModel';

@Component({
  selector: 'cousins-attributes-values',
  imports: [ReactiveFormsModule, NzFormModule, NzButtonModule, NzInputModule],
  templateUrl: './attributes-values.component.html',
  styleUrl: './attributes-values.component.css',
})
export class AttributesValuesComponent {

  attributesValuesForm: FormGroup;
  btnLoading: boolean = false;
  @Input() attributeName: string = '';

  @Output() attributeValueSave = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private dataService: DataService, private attributeService: AttributesService) {
    this.attributesValuesForm = this.fb.group({
      attributeValue: ['', Validators.required],
      attributeName: [{value: '', disabled: true}, Validators.required],
      alternateValues: [''],
      newAlternateValue: [''],
      // attributeGroupId   : [''],
    });
  }

  ngOnInit() {
    if (this.attributeName != '') {
      this.attributesValuesForm.get('attributeName')?.disable();
      this.attributesValuesForm.get('attributeName')?.setValue(this.attributeName);
    }
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
          this.dataService.ShowNotification('success', '', 'Attribute Values added successfully.');
          this.attributeValueSave.emit('save');
          this.attributesValuesForm.reset();
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

  handleCancel() {
    this.attributeValueSave.emit('cancel');
    this.attributesValuesForm.reset();
  }
}
