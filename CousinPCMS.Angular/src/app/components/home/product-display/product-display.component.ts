import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Product, ProductResponse } from '../../../shared/models/productModel';
import { DataService } from '../../../shared/services/data.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CategoryAttributeComponent } from '../category-attribute/category-attribute.component';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'cousins-product-display',
  imports: [CommonModule, NzSpinModule, NzToolTipModule, NzModalModule, CategoryAttributeComponent],
  templateUrl: './product-display.component.html',
  styleUrl: './product-display.component.css'
})
export class ProductDisplayComponent {

  @Input() selectedCategory: string = '';
  @Output() productSelected = new EventEmitter<number>();
  selectedProduct?: number;
  products: Product[] = [];
  displayText: string = 'Click a category to view the product';
  loading: boolean = false;
  categoryAttriIsVisible: boolean = false;
  categoryData: any = {};
  lstAllAttributeSets:any[]=[];

  allProductAtrributes: any[] = [];

  constructor(private homeService: HomeService, private dataService: DataService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory']) {
      // this.selectedProduct = 0;
      if (sessionStorage.getItem('categoryId')) {
        const productIdStr = sessionStorage.getItem('productId');
        const productId: number | undefined = productIdStr ? +productIdStr : undefined;
        this.selectedProduct = productId;
        this.loadProductsForCategory();
        this.getAllAttributeSetsByAttribute();
      } else {
        this.products = [];
        this.displayText = 'Click a category to view the product';
      }
    }
  }

  loadProductsForCategory() {
    if (this.selectedCategory) {
      this.products = [];
      this.loading = true;
      this.homeService.getProductListByCategoryId(this.selectedCategory).subscribe({
        next: (data: ProductResponse) => {
          if (data.isSuccess) {
            if (data.value && data.value.length > 0) {
              this.products = data.value.filter((res: Product) => res?.akiProductIsActive);
              if (this.products && this.products.length > 0) {
                this.displayText = '';
                this.productSelected.emit(this.selectedProduct);
              } else {
                this.displayText = 'No Product Found';
              }
            } else {
              this.displayText = 'No Product Found';
            }
          } else {
            this.displayText = 'Failed to load products'
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

  onProductClick(data: Product) {
    if (!data) return; // Prevents undefined errors
    this.selectedProduct = data.akiProductID;
    sessionStorage.setItem('productId', data.akiProductID.toString());
    sessionStorage.removeItem('itemNumber');
    this.productSelected.emit(data.akiProductID);
  }

  onProductRightClick(product: any, event: MouseEvent): void {
    event.preventDefault(); // Prevents the default right-click menu
    this.selectedProduct = product?.akiProductID;
    this.categoryAttriIsVisible = true; // Opens the modal
  }

  getAllAttributeSetsByAttribute(){
    this.homeService.getAttributeSetsByCategoryId(this.selectedCategory).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.lstAllAttributeSets = response.value;
          // this.allProductAtrributes= [...this.products,  ...this.lstAllAttributeSets];
          console.log('allProductAtrributes', this.allProductAtrributes)
        } else {
          this.dataService.ShowNotification('error', '', 'Failed to load attribute sets')        }
  
      }, error: () => {
        
        this.dataService.ShowNotification('error', '', 'Failed to load attribute sets');
      }
    })
  }
  handleOk(): void {
    this.categoryAttriIsVisible = false;
  }
  handleCancel(): void {
    this.categoryAttriIsVisible = false;
  }

}