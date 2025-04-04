import { Component, ViewChild } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Subscription } from 'rxjs';
import { SkusListComponent } from './skus-list/skus-list.component';
import { ProductsService } from './products.service';
import { ProductRequest, ProductUpdateResponse } from '../../shared/models/productModel';

@Component({
  selector: 'cousins-product',
  imports: [ NzTabsModule,  // ✅ Import Tabs
             NzButtonModule,
             ProductDetailsComponent,
             SkusListComponent
            ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  activeTab: number = 0; // Default tab
  deleteLoading: boolean = false;
  loading: boolean = false;
  productData!: any;
  
 private productSubscription!: Subscription;
 @ViewChild(ProductDetailsComponent) productDetailsComp!: ProductDetailsComponent;

  constructor(private homeService: HomeService,private dataService : DataService, 
    private readonly router: Router, private productService : ProductsService) {
  }

  ngOnInit(): void {
    this.productSubscription = this.homeService.selectedProduct$.subscribe(product => {
      if (product) {
          this.productData = product[0];
      }
    });
    
  }

  cancle() {
    this.router.navigate(['/home']);
  }

  delete() {
    const proData = this.productDetailsComp.getFormData();
    this.deleteLoading = true;
    this.productService.deleteProduct(proData.akiProductID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Product Successfully Deleted');
          this.router.navigate(['/home']);
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
     const productData = this.productDetailsComp.getFormData();

     if (productData.aki_Layout_Template) {
        productData.akiProductPrintLayoutTemp = true;
     }

     const req: ProductRequest = {
      ...productData,
      categoryName: productData.category_Name,
    };

    delete (req as any).category_Name;
    delete (req as any).akiProductDescription;

     this.loading = true;
     this.productService.updateProduct(req).subscribe({
       next: (response: ProductUpdateResponse) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Product Details Updated Successfully');
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', "Product Details Failed Updated");
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
       }
     });
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

}
