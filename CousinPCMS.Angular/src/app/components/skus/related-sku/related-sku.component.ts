import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'cousins-related-sku',
  imports: [ FormsModule,
             NzFormModule,
             NzInputModule,
             NzTableModule,
             NzIconModule ],
  templateUrl: './related-sku.component.html',
  styleUrl: './related-sku.component.css'
})
export class RelatedSkuComponent {

  searchValue: string = '';
  skuName: string = '';
  relatedSkusList: any[] = [];

      // Search filter function
  onSearch() {
    const searchText = this.searchValue.toLowerCase();
      // this.filteredCategories = this.categoryList.filter(category =>
      //   category.akiCategoryName.toLowerCase().includes(searchText)
      // );
  }

}
