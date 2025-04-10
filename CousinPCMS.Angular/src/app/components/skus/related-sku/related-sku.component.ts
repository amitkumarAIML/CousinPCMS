import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SkusService } from '../skus.service';
import { DataService } from '../../../shared/services/data.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'cousins-related-sku',
  imports: [ FormsModule,
             NzFormModule,
             NzInputModule,
             NzTableModule,
             NzIconModule,
             NzCheckboxModule
           ],
  templateUrl: './related-sku.component.html',
  styleUrl: './related-sku.component.css'
})
export class RelatedSkuComponent {

  searchValue: string = '';
  skuName: string = '';
  skuId!: number;
  relatedSkusList: any[] = [];
  loading: boolean = false;
  @Input() skuData!: any;

  constructor(private skusService: SkusService, private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
      if (changes['skuData']) {
        if (this.skuData) {
            this.skuName = this.skuData.skuName;
            this.skuId = this.skuData.akiSKUID;
        }
      }
  }

  ngOnInit() {
    this.loadRelatedSku();
  }

      // Search filter function
  onSearch() {
    const searchText = this.searchValue.toLowerCase();
      // this.filteredCategories = this.categoryList.filter(category =>
      //   category.akiCategoryName.toLowerCase().includes(searchText)
      // );
  }

    loadRelatedSku() {
      const itemNumber = sessionStorage.getItem('itemNumber') || '';
      this.loading = true;
      this.skusService.getRelatedSkuItem(itemNumber).subscribe({
        next: (data) => {
          if (data.isSuccess) {
              this.relatedSkusList = data.value;
          }
          else {
            this.dataService.ShowNotification('error', '', "Filed to data load");
          }
          this.loading = false;
        },
        error: () => { 
          this.loading = false;
          this.dataService.ShowNotification('error', '', "Something went wrong");
        }
      });
    }

}
