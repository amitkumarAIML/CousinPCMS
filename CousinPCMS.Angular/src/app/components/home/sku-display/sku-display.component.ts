import { Component, Input, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'cousins-sku-display',
  imports: [NzSpinModule],
  templateUrl: './sku-display.component.html',
  styleUrl: './sku-display.component.css'
})
export class SkuDisplayComponent {
  @Input() selectedProductId!: number;
  skus : any[]= [];
  displayText: string = 'Click on a product to view the SKU';
  loading: boolean = false;

  constructor(private homeService: HomeService, private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedProductId < 0) {
      this.displayText = 'Click on a product to view the SKU';
      this.skus = [];
    }
    if (changes['selectedProductId'] && this.selectedProductId) {
      this.loadSkuForProduct();
    }
  }

  loadSkuForProduct() {
    this.loading = true;
    this.homeService.getSkuByProductId(this.selectedProductId).subscribe({
      next: (data) => {
        // this.skus = data.filter((res: any) => res.akiSKUIsActive);
        this.skus = data;
        if (this.skus && this.skus.length > 0) {
          this.displayText = ''; // Clear message if data exists
        } else {
          this.displayText = 'No SKU Found';
        }
        this.homeService.setSelectedSkU(this.skus);
        this.loading = false;

      },
      error: () => { 
        this.loading = false;
        this.displayText = 'Failed to load SKU' 
        this.dataService.ShowNotification('error', '', "Something went wrong");
      }
    });
  }

}
