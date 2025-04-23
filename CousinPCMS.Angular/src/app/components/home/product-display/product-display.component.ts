import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Product, ProductResponse } from '../../../shared/models/productModel';
import { DataService } from '../../../shared/services/data.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CategoryAttributeComponent } from '../category-attribute/category-attribute.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProductComponent } from "../../product/product.component";

@Component({
  selector: 'cousins-product-display',
  imports: [CommonModule, NzSpinModule, NzToolTipModule, NzModalModule, CategoryAttributeComponent, NzFormModule, NzIconModule, FormsModule, NzInputModule, ProductComponent],
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
  categoryProductVisible: boolean = false;
  categoryData: any = {};
  lstAllAttributeSets: any[] = [];

  allProductAtrributes: any[] = [];
  searchValue: string = '';
  filteredData: any[] = [];

  constructor(private homeService: HomeService, private dataService: DataService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategory']) {
      // this.selectedProduct = 0;
      if (sessionStorage.getItem('categoryId')) {
        const productIdStr = sessionStorage.getItem('productId');
        const productId: number | undefined = productIdStr ? +productIdStr : undefined;
        this.selectedProduct = productId;
        this.getDataInParallel()
      } else {
        this.products = [];
        this.displayText = 'Click a category to view the product';
      }
      this.homeService.reloadAttributes$.subscribe(() => {
        this.getDataInParallel();
      });
    }
  }

  onProductClick(data: Product) {
    if (!data) return; // Prevents undefined errors
    this.selectedProduct = data.akiProductID;
    sessionStorage.setItem('productId', data.akiProductID.toString());
    sessionStorage.removeItem('itemNumber');
    this.productSelected.emit(data.akiProductID);
    
  }
  onProductRightClick(product: any): void {
    this.selectedProduct = product?.akiProductID;
    this.categoryData = product;
    this.categoryAttriIsVisible = true; // Opens the modal
  }

  handleOk(val: string) {
    this.categoryAttriIsVisible = false;
    this.categoryProductVisible = false;
    if(val !== 'cancel') {
      this.getDataInParallel();
    }
  }

  handleCancel() {
    this.categoryAttriIsVisible = false;
  }

  getDataInParallel(): void {
    // this.loading = true;
    this.products = [];
    this.lstAllAttributeSets = [];
    if (!this.selectedCategory) return;
    forkJoin({
      productList: this.homeService.getProductListByCategoryId(this.selectedCategory),
      attributeList: this.homeService.getDistinctAttributeSetsByCategoryId(this.selectedCategory)
    }).subscribe({
      next: ({ productList, attributeList }) => {
        if (productList.isSuccess) {
          if (productList.value && productList.value.length > 0) {
            this.products = productList.value.filter((res: Product) => res?.akiProductIsActive);
            if (this.products && this.products.length > 0) {
              this.displayText = '';
              this.productSelected.emit(this.selectedProduct);
            } else {
              this.displayText = 'No Product Found';
            }
          } else {
            this.displayText = 'No Product Found';
          }
        }
        if (attributeList.isSuccess) {
          this.lstAllAttributeSets = attributeList.value;
          this.allProductAtrributes = [
            ...(Array.isArray(this.products) ? this.products : []),
            ...(Array.isArray(this.lstAllAttributeSets) ? this.lstAllAttributeSets : [])
          ];
          this.filteredData = [...this.allProductAtrributes];
        } else {
          this.dataService.ShowNotification('error', '', 'Failed to load attribute sets')
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error in API calls', error);
        this.loading = false;
      }
    });
  }

  onSearch() {
    const searchText = this.searchValue?.toLowerCase().replace(/\s/g, '') || '';
  
    if (!searchText) {
      this.filteredData = [...this.allProductAtrributes];
      return;
    }
  
    this.filteredData = this.allProductAtrributes.filter(item => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';
      
      return  normalize(item.akiProductName).includes(searchText) || 
              normalize(item.attributeSetName).includes(searchText)
    }); 
    if (this.filteredData.length === 0) {
      this.displayText = 'No Data';
    }
  }
  
  clearSearchText(): void {
    this.searchValue = '';
    this.filteredData = [...this.allProductAtrributes];
  }

  editProduct(){
    if (!this.selectedProduct) {
      this.dataService.ShowNotification('error','','Please select product name.')
      return;
    }  
    this.categoryProductVisible = true;
  }
  addProduct(){ 
    // sessionStorage.removeItem('productId');
    this.categoryProductVisible = true;
  }

}