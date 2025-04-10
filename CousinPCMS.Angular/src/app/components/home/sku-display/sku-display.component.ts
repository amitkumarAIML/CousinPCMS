import { Component, Input, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DataService } from '../../../shared/services/data.service';
import { SKuList, SkuListResponse } from '../../../shared/models/skusModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cousins-sku-display',
  imports: [NzSpinModule, CommonModule],
  templateUrl: './sku-display.component.html',
  styleUrl: './sku-display.component.css'
})
export class SkuDisplayComponent {

  @Input() selectedProductId!: number;
  skus : SKuList[]= [];
  displayText: string = 'Click on a product to view the SKU';
  loading: boolean = false;
  selectedSku!: number

  constructor(private homeService: HomeService, private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedProductId <= 0) {
      this.displayText = 'Click on a product to view the SKU';
      this.skus = [];
    }
    if (changes['selectedProductId'] && this.selectedProductId) {
      const productIdStr = sessionStorage.getItem('itemNumber') || '';
      this.selectedSku =  +productIdStr;
      this.loadSkuForProduct();
    }
  }

  loadSkuForProduct() {
    this.loading = true;
    this.skus = [];
    this.homeService.getSkuByProductId(this.selectedProductId).subscribe({
      next: (data: SkuListResponse) => {
        if (data.isSuccess) {
            if (data.value && data.value.length > 0) {
              this.skus = data.value.filter((res: SKuList) => res?.akiSKUIsActive);
              if (this.skus && this.skus.length > 0) {
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

}
