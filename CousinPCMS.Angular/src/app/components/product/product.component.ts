import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Subscription } from 'rxjs';
import { SkusListComponent } from './skus-list/skus-list.component';
import { ProductsService } from './products.service';
import { ProductRequest, ProductResponse, ProductUpdateResponse } from '../../shared/models/productModel';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'cousins-product',
  imports: [ NzTabsModule,  // ✅ Import Tabs
             NzButtonModule,
             ProductDetailsComponent,
             SkusListComponent,
             NzSpinModule,
             NzPopconfirmModule,
             NzIconModule
            ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  activeTab: number = 0; // Default tab
  deleteLoading: boolean = false;
  loading: boolean = true;
  btnLoading: boolean = false;
  productData!: any;
  
 private productSubscription!: Subscription;
 @Output() eventComplete = new EventEmitter<string>();

 @ViewChild(ProductDetailsComponent) productDetailsComp!: ProductDetailsComponent;

  constructor(private dataService : DataService, 
    private readonly router: Router, private productService : ProductsService) {
  }

  ngOnInit(): void {  
    this.getProductById();
   
  }

  getProductById() {
    const productId = sessionStorage.getItem('productId') || '';
    console.log('productId',productId);
    
    if (productId) {
    this.productService.getProductById(productId).subscribe({
      next: (response: ProductResponse) => {
        if (response.isSuccess) {
          this.productData = response.value && response.value[0];
        } else {
          this.dataService.ShowNotification('error', '', 'Failed To Load Data');
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
    } else {
      this.loading = false;
      this.dataService.ShowNotification('error', '', 'Please select product name from home page');
    }
  }

  cancel() {
    this.router.navigate(['/home']);
    this.eventComplete.emit('cancel');
  }

  delete() {
    const proData = this.productDetailsComp.getFormData();
    this.deleteLoading = true;
    this.productService.deleteProduct(proData.akiProductID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Product Successfully Deleted');
          sessionStorage.removeItem('productId');
          sessionStorage.removeItem('itemNumber');
          sessionStorage.removeItem('skuId');
          this.router.navigate(['/home']);
          this.eventComplete.emit('delete');
        } else {
          this.dataService.ShowNotification('error', '', 'Product Details Failed Deleted');
        }
        this.deleteLoading = false;
      },
      error: (err) => {
        this.deleteLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      }
    });

  }
 
  saveDetails () {
     this.productDetailsComp.productForm.markAllAsTouched();

     if (!this.productDetailsComp.productForm.valid) {
       this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
       return;
     }
 
     // Get data from both components (if forms are valid)
    //  const productData = this.productDetailsComp.getFormData();
    const productData = this.dataService.cleanEmptyNullToString(this.productDetailsComp.getFormData());

     if (productData.aki_Layout_Template) {
        productData.akiProductPrintLayoutTemp = true;
     }

     const req: ProductRequest = {
      ...productData,
      categoryName: productData.category_Name,
    };

    delete (req as any).category_Name;
     this.btnLoading = true;
     this.productService.updateProduct(req).subscribe({
       next: (response: ProductUpdateResponse) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Product Details Updated Successfully');
          this.router.navigate(['/home']);
          this.eventComplete.emit('save');
        } else {
          this.dataService.ShowNotification('error', '', "Product Details Failed Updated");
        }
         this.btnLoading = false;
       },
       error: (err) => {
          this.btnLoading = false;
          if (err?.error) {
            this.dataService.ShowNotification('error', '', err.error.title);
          } else {
            this.dataService.ShowNotification('error', '', 'Something went wrong');
          }
       }
     });
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

}
