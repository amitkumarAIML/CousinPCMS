import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Product } from '../../../shared/models/productModel';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'cousins-product-display',
  imports: [CommonModule, NzSpinModule],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.css'
})
export class ProductDisplayComponent {

  @Input() selectedCategory: string = '';
  @Output() productSelected = new EventEmitter<number>();
  selectedProduct!: number; 
  products: Product[] = [];
  displayText: string = 'Click a category to view the product';
  loading: boolean = false;

  constructor(private homeService: HomeService, private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory']) {
       this.loadProductsForCategory();
    }
  }

  loadProductsForCategory() {
    if (this.selectedCategory) {
      this.loading = true;
      this.homeService.getProductListByCategoryId(this.selectedCategory).subscribe({
        next: (data: Product[]) => { 
          if (data && data.length > 0) {
            this.products = data.filter((res: Product) => res?.akiProductIsActive);
            if (this.products && this.products.length > 0) {
              this.displayText = ''; 
            } else {
              this.displayText = 'No Product Found';
            } 
          } else {
            this.displayText = 'No Product Found';
          }
          this.loading = false;
        }, 
        error: () => { 
          this.displayText = 'Failed to load products';
          this.loading = false; 
          this.dataService.ShowNotification('error', '', "Something went wrong");
        }
      });
    } else {
      this.products = [];
      this.loading = false; 
      this.displayText = 'Click on a category to view the product';
    }
  }

  onProductClick(productId: number) {
    if (!productId) return; // Prevents undefined errors
    this.selectedProduct = productId;
    const pro = this.products.filter((res) => res.akiProductID === productId);
    if (pro.length > 0) {
      this.homeService.setSelectedProduct(pro);
    }
    this.productSelected.emit(productId);
  }
}
