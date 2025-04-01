import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'cousins-product-display',
  imports: [CommonModule, NzSpinModule],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.css'
})
export class ProductDisplayComponent {

  @Input() selectedCategory: string = '';
  @Output() productSelected = new EventEmitter<string>();
  selectedProduct : string = ''; 
  products: any[] = [];
  displayText: string = 'Click a category to view the product';
  loading: boolean = false;

  constructor(private homeService: HomeService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory']) {
       this.loadProductsForCategory();
    }
  }

  loadProductsForCategory() {
    if (this.selectedCategory) {
      this.loading = true;
      this.homeService.getProductListByCategoryId(this.selectedCategory).subscribe({
        next: (data) => { 
          if (data && data.length > 0) {
            this.products = data
            this.displayText = ''; // Clear message if data exists
          } else {
            this.products = [];
            this.displayText = 'No Product Found';
          }
          this.loading = false;
        },
        error: () => { 
          this.displayText = 'Failed to load products';
          this.loading = false; 
        }
      });
    } else {
      this.products = [];
      this.displayText = 'Click on a category to view the product';
    }
  }

  onProductClick(productId: string) {
    if (!productId) return; // Prevents undefined errors
    this.selectedProduct = productId;
    const pro = this.products.filter((res) => res.akiProductID === productId);
    if (pro.length > 0) {
      this.homeService.setSelectedProduct(pro);
      console.log('productId ', productId,pro)

    }
    this.productSelected.emit(productId);
  }
}
