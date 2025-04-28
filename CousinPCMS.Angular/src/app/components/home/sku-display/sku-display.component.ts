import { Component, Input, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DataService } from '../../../shared/services/data.service';
import { SKuList, SkuListResponse } from '../../../shared/models/skusModel';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SkusComponent } from '../../skus/skus.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SkusListComponent } from '../../product/skus-list/skus-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'cousins-sku-display',
  imports: [NzSpinModule, CommonModule, NzFormModule, NzIconModule, FormsModule, NzInputModule, SkusComponent, NzModalModule, SkusListComponent,
    NzTableModule,
    FormsModule,
    NzCheckboxModule,
    NzIconModule
  ],
  templateUrl: './sku-display.component.html',
  styleUrl: './sku-display.component.css'
})
export class SkuDisplayComponent {

  @Input() selectedProductId!: number;
  skus: SKuList[] = [];
  displayText: string = 'Click on a product to view the SKU';
  loading: boolean = false;
  selectedSku: number | null = null;
  searchValue: string = '';
  filteredData: SKuList[] = [];
  productSkusVisible: boolean = false;
  selectedRow: any = null;
  constructor(private homeService: HomeService, private dataService: DataService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedProductId <= 0 && !this.selectedProductId) {
      this.displayText = 'Click on a product to view the SKU';
      this.skus = [];
      this.filteredData = [];
    }
    if (changes['selectedProductId'] && this.selectedProductId) {
      const productIdStr = sessionStorage.getItem('itemNumber') || '';
      this.selectedSku = +productIdStr;
      this.loadSkuForProduct();
    }
  }
  loadSkuForProduct() {
    this.loading = true;
    this.skus = [];
    this.filteredData = [];
    this.homeService.getSkuByProductId(this.selectedProductId).subscribe({
      next: (data: SkuListResponse) => {
        if (data.isSuccess) {
          if (data.value && data.value.length > 0) {
            this.skus = data.value.filter((res: SKuList) => res?.akiSKUIsActive);
            this.filteredData = [...this.skus];
            if (this.filteredData && this.filteredData.length > 0) {
              this.displayText = '';
            } else {
              this.displayText = 'No SKU Found';
            }
          } else {
            this.displayText = 'No SKU Found';
          }
        }
        else {
          this.displayText = 'Failed to load SKU'
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.displayText = 'Failed to load SKU'
        this.dataService.ShowNotification('error', '', "Something went wrong");
      }
    });
  }

  onSkuClick(data: SKuList) {
    if (!data) return;
    this.selectedSku = data.akiSKUID;
    sessionStorage.setItem('itemNumber', data.akiitemid);
  }
  onSearch() {
    const searchText = this.searchValue?.toLowerCase().replace(/\s/g, '') || '';

    if (!searchText) {
      this.filteredData = [...this.skus];
      return;
    }

    this.filteredData = this.skus.filter(item => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';

      return normalize(item.skuName).includes(searchText) ||
        normalize(item.akiManufacturerRef).includes(searchText) ||
        normalize(item.akiitemid).includes(searchText) ||
        normalize(item.akiListOrder?.toString()).includes(searchText) ||
        normalize(item.akiAltSKUName).includes(searchText) ||
        normalize(item.akiCommodityCode).includes(searchText)
    });
    if (this.filteredData.length === 0) {
      this.displayText = 'No SKU Found';
    }
  }

  clearSearchText(): void {
    this.searchValue = '';
    this.filteredData = [...this.skus];
  }

  handleCancel(val: string) {
    this.productSkusVisible = false;
    if (val !== 'cancel') {
      this.loadSkuForProduct();
    }
  }
  editSku() {
    if (!this.selectedSku) {
      this.productSkusVisible = false;
      this.dataService.ShowNotification('error', '', 'Please select sku name.');
      return;
    }
    this.productSkusVisible = true;
  }
  addSKU() {
    // sessionStorage.removeItem('productId');
    this.productSkusVisible = true;
  }
  // Handle Row Click to Select/Unselect
  onRowSelect(row: any): void {
    // Toggle selection on click
    this.selectedRow = row === this.selectedRow ? null : row;

    if (row === this.selectedRow) {
      this.selectedSku = row?.akiSKUID;
    } else {
      this.selectedSku = null;
    }
  }

}
