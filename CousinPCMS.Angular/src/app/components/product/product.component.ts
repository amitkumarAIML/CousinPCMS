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
          console.log('Received product:', product);
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
        this.dataService.ShowNotification('success', '', 'Product Successfully deleted');
        this.router.navigate(['/home']);
        this.deleteLoading = false;
        
      },
      error: (error) => {
        this.deleteLoading = false;
        this.dataService.ShowNotification('error', '', error.error);
        console.error('Error fetching departments:', error.error);
      }
    });

  }
 

  saveDetails () {
   
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
      console.log('Unsubscribed from selectedProduct$');
    }
  }

}
