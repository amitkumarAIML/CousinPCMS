import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { SKuList } from '../../../shared/models/skusModel';

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

  skusList: SKuList[] = [];
  selectedRow: any = null; // Store the selected row
  private skusSubscription!: Subscription;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.skusSubscription = this.homeService.selectedSkUList$.subscribe(skus => {
      if (skus) {
          this.skusList = skus;
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
