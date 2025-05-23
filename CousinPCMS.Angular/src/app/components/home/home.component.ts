import { Component } from '@angular/core';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { ProductDisplayComponent } from './product-display/product-display.component';
import { SkuDisplayComponent } from './sku-display/sku-display.component';

@Component({
  selector: 'cousins-home',
  imports: [TreeViewComponent, ProductDisplayComponent, SkuDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedCategory: string = '';
  selectedProductId!: number;

  onCategorySelected(categoryId: string) {
    this.selectedCategory = categoryId;
    this.selectedProductId = 0;
  }

  onProductSelected(productId: number) {
    this.selectedProductId = productId;
  }

}
