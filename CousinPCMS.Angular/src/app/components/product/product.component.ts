import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DataService } from '../../shared/services/data.service';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cousins-product',
  imports: [ NzTabsModule,  // ✅ Import Tabs
             NzButtonModule,
             ProductDetailsComponent
            ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  activeTab: number = 0; // Default tab
  loading: boolean = false;
  productData!: any;
  
 private productSubscription!: Subscription;

  constructor(private homeService: HomeService,private dataService : DataService, private readonly router: Router) {
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
 

  saveDetails () {
   
  }

  ngOnDestroy() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
      console.log('Unsubscribed from selectedProduct$');
    }
  }

}
