import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { SKuList, SkuListResponse } from '../../../shared/models/skusModel';
import { DataService } from '../../../shared/services/data.service';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'cousins-skus-list',
  imports: [
    NzTableModule,
    FormsModule,
    NzCheckboxModule,
    NzIconModule
  ],
  templateUrl: './skus-list.component.html',
  styleUrl: './skus-list.component.css'
})
export class SkusListComponent {
  loading: boolean = true;
  skusList: SKuList[] = [];
  selectedRow: any = null; // Store the selected row
  private skusSubscription!: Subscription;

  constructor(private homeService: HomeService, private dataService: DataService) {}

  ngOnInit(): void {
    // this.skusSubscription = this.homeService.selectedSkUList$.subscribe(skus => {
    //   if (skus) {
    //       this.skusList = skus;
    //   }
    // });
    this.loadSkuForProduct();
  }

  loadSkuForProduct() {
    const productId = sessionStorage.getItem('productId') || '';
      this.homeService.getSkuByProductId(+productId).subscribe({
        next: (data: SkuListResponse) => {
          if (data.isSuccess) {
              if (data && data.value.length > 0) {
                this.skusList = data.value.filter((res: SKuList) => res?.akiSKUIsActive);
              } else {
                this.dataService.ShowNotification('error', '', "No Data");
              }
          } else {
            this.dataService.ShowNotification('error', '', "No Data");
          }
          this.loading = false;
        },
        error: () => { 
          this.loading = false;
          this.dataService.ShowNotification('error', '', "Something went wrong");
        }
      });
    }

  // Handle Row Click to Select/Unselect
  onRowSelect(row: any): void {
    this.selectedRow = row === this.selectedRow ? null : row;
  }

  // Add Class to Selected Rows
  setRowClass = (row: any) => row.selected ? 'selected-row' : '';

  ngOnDestroy() {
    if (this.skusSubscription) {
      this.skusSubscription.unsubscribe();
    }
  }

}
