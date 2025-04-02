import { Component, Input, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'cousins-sku-display',
  imports: [NzSpinModule],
  templateUrl: './sku-display.component.html',
  styleUrl: './sku-display.component.css'
})
export class SkuDisplayComponent {
  @Input() selectedProductId: string = '';
  skus : any[]= [];
  displayText: string = 'Click on a product to view the SKU';
  loading: boolean = false;

  constructor(private homeService: HomeService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedProductId === '') {
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
        if (data && data.length > 0) {
          this.skus = data
          this.homeService.setSelectedSkU(this.skus);
          this.displayText = ''; // Clear message if data exists
        } else {
          this.skus = [];
          this.displayText = 'No SKU Found';
        }
        this.homeService.setSelectedSkU(this.skus);
        this.loading = false;

      },
      error: () => { 
        this.loading = false;
        this.displayText = 'Failed to load SKU' 
      }
    });
  }

}
