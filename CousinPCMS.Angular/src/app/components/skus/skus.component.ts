import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {SkuDetailsComponent} from './sku-details/sku-details.component';
import {Subscription} from 'rxjs';
import {HomeService} from '../home/home.service';
import {DataService} from '../../shared/services/data.service';
import {RelatedSkuComponent} from './related-sku/related-sku.component';
import {SkusService} from './skus.service';
import {AttributeSkuComponent} from './attribute-sku/attribute-sku.component';
import {SKuList, SkuRequestModel} from '../../shared/models/skusModel';
import { ApiResponse } from '../../shared/models/generalModel';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'cousins-skus',
  imports: [
    NzTabsModule, // ✅ Import Tabs
    NzButtonModule,
    SkuDetailsComponent,
    RelatedSkuComponent,
    AttributeSkuComponent,
    NzSpinModule,
    NzIconModule,
    NzPopconfirmModule
  ],
  templateUrl: './skus.component.html',
  styleUrl: './skus.component.css',
})
export class SkusComponent {
  activeTab: number = 0; // Default tab
  deleteLoading: boolean = false;
  loading: boolean = true;
  btnSaveLoading: boolean = false;

  skuData!: SKuList;
  private skuSubscription!: Subscription;
   @Output() eventComplete = new EventEmitter<string>();
  @ViewChild(SkuDetailsComponent) skusDetailsComp!: SkuDetailsComponent;

  constructor(private readonly router: Router, private homeService: HomeService, private dataService: DataService, private skuService: SkusService) {}

  ngOnInit(): void {
    this.getSkuByItemNumber();  
  }

  cancle() {
    this.router.navigate(['/home']);
    this.eventComplete.emit('cancle');
  }

  getSkuByItemNumber() {
    const itemNumber = sessionStorage.getItem('itemNumber') || '';
    if (itemNumber) {
      this.loading = true;
      this.skuService.getSkuItemById(itemNumber).subscribe({
        next: (response: ApiResponse<SKuList[]>) => {
          if (response.isSuccess) {
            if (response.value &&  response.value.length > 0)
            this.skuData = response.value[0];
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
      this.dataService.ShowNotification('error', '', 'Please select sku name from home page');
    }
  }

  delete() {
    const proData = this.skusDetailsComp.getFormData();
    this.deleteLoading = true;
    this.skuService.deleteSkus(proData.akiSKUID).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Skus Successfully Deleted');
          sessionStorage.removeItem('itemNumber');
          sessionStorage.removeItem('skuId');
          this.router.navigate(['/home']);
          this.eventComplete.emit('delete');
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
      },
    });
  }

  saveDetails() {
    this.skusDetailsComp.skuForm.markAllAsTouched();

    if (!this.skusDetailsComp.skuForm.valid) {
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return;
    }

    const skuData: SkuRequestModel = this.dataService.cleanEmptyNullToString(this.skusDetailsComp.getFormData());

    if (skuData.akiLayoutTemplate) {
      skuData.akiPrintLayoutTemp = true;
    }
    this.btnSaveLoading = true;
    this.skuService.updateSkus(skuData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Sku Details Updated Successfully');
          this.router.navigate(['/home']);
          this.eventComplete.emit('save');
        } else {
          this.dataService.ShowNotification('error', '', 'Sku Details Failed To Updated');
        }
        this.btnSaveLoading = false;
      },
      error: (err) => {
        this.btnSaveLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

  ngOnDestroy() {
    if (this.skuSubscription) {
      this.skuSubscription.unsubscribe();
    }
  }
  btnCancel(): void {
    this.dataService.ShowNotification('info', '', 'Delete action cancelled');
  }
}
