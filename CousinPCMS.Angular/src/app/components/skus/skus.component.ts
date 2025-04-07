import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SkuDetailsComponent } from './sku-details/sku-details.component';
import { Subscription } from 'rxjs';
import { HomeService } from '../home/home.service';
import { DataService } from '../../shared/services/data.service';
import { RelatedSkuComponent } from './related-sku/related-sku.component';
import { SkusService } from './skus.service';
import { AttributeSkuComponent } from './attribute-sku/attribute-sku.component';

@Component({
  selector: 'cousins-skus',
  imports: [ NzTabsModule,  // ✅ Import Tabs
             NzButtonModule,
             CommonModule,
             SkuDetailsComponent,
             RelatedSkuComponent,
             AttributeSkuComponent
          ],
  templateUrl: './skus.component.html',
  styleUrl: './skus.component.css'
})
export class SkusComponent {
  activeTab: number = 0; // Default tab
  deleteLoading: boolean = false;
  loading: boolean = false;
  
  skuData!: any;
  private skuSubscription!: Subscription;
 @ViewChild(SkuDetailsComponent) skusDetailsComp!: SkuDetailsComponent;

  constructor(private readonly router: Router,private homeService: HomeService,private dataService : DataService,
      private skuService: SkusService
  ) {}

  ngOnInit(): void {
    this.skuSubscription = this.homeService.selectedSkU$.subscribe(skus => {
      if (skus) {
          this.skuData = skus[0];
      }
    });   
  }

  cancle() {
    this.router.navigate(['/home']);
  }

  delete() {
    const proData = this.skusDetailsComp.getFormData();
    this.deleteLoading = true;
    this.skuService.deleteSkus(proData.akiSKUID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Skus Successfully Deleted');
          this.router.navigate(['/home']);
        } else {
          this.dataService.ShowNotification('error', '', 'Skus Details Failed Deleted');
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

  ngOnDestroy() {
    if (this.skuSubscription) {
      this.skuSubscription.unsubscribe();
    }
  }

}
