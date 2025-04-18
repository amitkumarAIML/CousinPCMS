import {Component, Input, SimpleChanges} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NzTableModule} from 'ng-zorro-antd/table';
import {SkusService} from '../skus.service';
import {DataService} from '../../../shared/services/data.service';
import {ApiResponse} from '../../../shared/models/generalModel';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LikedSkuModel } from '../../../shared/models/skusModel';

@Component({
  selector: 'cousins-attribute-sku',
  imports: [NzTableModule, FormsModule, NzIconModule, NzInputModule, NzFormModule,NzCheckboxModule],
  templateUrl: './attribute-sku.component.html',
  styleUrl: './attribute-sku.component.css',
})
export class AttributeSkuComponent {
  linkedAttributeList: any[] = [];
  searchValue: string = '';
  akiitemid!: number;
  loading: boolean = false;
  @Input() skuData!: any;
  linkedAttributeListFilter: any[] = [];

  constructor(private skusService: SkusService, private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skuData']) {
      if (this.skuData) {
        this.akiitemid = this.skuData.akiitemid;
        this.getSkuLinkedAttributes();
      }
    }
  }

  onSearch() {
    const searchText = this.searchValue?.toLowerCase().replace(/\s/g, '') || '';

    if (!searchText) {
      this.linkedAttributeListFilter = [...this.linkedAttributeList];
      return;
    }

    this.linkedAttributeListFilter = this.linkedAttributeList.filter((item) => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';

      return normalize(item.akiAttributeName).includes(searchText) || normalize(item.akiAttributeValue).includes(searchText);
    });
  }

  clearSearchText(): void {
    this.searchValue = '';
    this.linkedAttributeListFilter = [...this.linkedAttributeList];
  }

  getSkuLinkedAttributes() {
    this.skusService.getSkuLinkedAttributes(this.akiitemid).subscribe({
      next: (reponse: ApiResponse<LikedSkuModel[]>) => {
        if (reponse.isSuccess) {
          if (reponse.value && reponse.value.length > 0) {
            this.linkedAttributeList = reponse.value;
            this.linkedAttributeListFilter = [...this.linkedAttributeList];
          }
        } else {
          this.dataService.ShowNotification('error', '', reponse.exceptionInformation);
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }
}
