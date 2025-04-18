import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DataService} from '../../../shared/services/data.service';
import {SkusService} from '../skus.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {Router, RouterLink} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {ApiResponse} from '../../../shared/models/generalModel';
import {AttributeModel} from '../../../shared/models/attributeModel';
import {AttributeValueModel} from '../../../shared/models/attributesModel';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzTableModule} from 'ng-zorro-antd/table';
import { LikedSkuModel } from '../../../shared/models/skusModel';

@Component({
  selector: 'cousins-attribute-multi-upload',
  imports: [FormsModule, NzSpinModule, NzButtonModule, NzCheckboxModule, NzTableModule, RouterLink],
  templateUrl: './attribute-multi-upload.component.html',
  styleUrl: './attribute-multi-upload.component.css',
})
export class AttributeMultiUploadComponent {
  loading: boolean = false;
  btnLoading: boolean = false;
  attributeNames?: any;
  headers: string[] = [];
  attributeList: AttributeValueModel[] = [];
  // Group values by attributeName
  groupedValues: {[key: string]: any[]} = {};
  rowsArray: number[] = [];

  allChecked = false;

  constructor(private skusService: SkusService, private dataService: DataService, private route: Router) {}

  ngOnInit(): void {
    const stored = sessionStorage.getItem('attributeNames');
    this.attributeNames = stored ? JSON.parse(stored) : [];
    this.headers = this.attributeNames;
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.loading = true;
    const req = {
      attributeNames: this.attributeNames,
    };
    this.skusService.getAttributeValuesByListofNames(req).subscribe({
      next: (reponse: ApiResponse<AttributeValueModel[]>) => {
        if (reponse.isSuccess) {
          if (reponse.value && reponse.value.length > 0) {
            this.attributeList = reponse.value;
            if (this.attributeList.length > 0) {
              this.headers.forEach((header) => {
                this.groupedValues[header] = this.attributeList.filter((val) => val.attributeName === header);
              });
              this.headers = Object.keys(this.groupedValues);
              const maxRows = Math.max(...this.headers.map((h) => this.groupedValues[h]?.length || 0));
              this.rowsArray = Array.from({length: maxRows}, (_, i) => i);
            }
          } else {
            this.dataService.ShowNotification('error', '', 'No Data');
          }
        } else {
          this.dataService.ShowNotification('error', '', 'Failed To Load Data');
        }
        this.loading = false;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
        this.loading = false;
      },
    });
  }

  getMaxRows(): number {
    return Math.max(...this.headers.map((h) => this.groupedValues[h]?.length || 0));
  }

  cancel() {
    sessionStorage.removeItem('attributeNames');
    this.route.navigate(['/skus']);
  }

  changeLinkedAttributeValues(event: boolean, data: any) {
    const req: LikedSkuModel = {
      akiItemNo: sessionStorage.getItem('itemNumber') || '',
      akiAttributeName: data.attributeName,
      akiAttributeValue: data.attributeValue,
      akiLink: data.attributeValueLinkedToSKU,
    };

    this.skusService.addUpdateSKULinkedAttribute(req).subscribe({
      next: (reponse: ApiResponse<LikedSkuModel>) => {
        if (reponse.isSuccess) {
          if (reponse.value) {
            this.dataService.ShowNotification('success', '', 'Attribute Value Successfully Updated');
          }
        } else {
          this.dataService.ShowNotification('error', '', reponse.exceptionInformation);
        }
        this.loading = false;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
        this.loading = false;
      },
    });
  }
}
