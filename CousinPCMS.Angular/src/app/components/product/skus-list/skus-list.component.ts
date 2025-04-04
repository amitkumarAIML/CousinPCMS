import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { HomeService } from '../../home/home.service';

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

  // listOfData: ItemData[] = [];

  listOfData = [
    {
      subName: 'Black 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917018',
      listOrder: 10,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Black 12mm',
      commodityCode: '91120003',
       selected: false,
      
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: false,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
      selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
      selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
      selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }, {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    },
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }
    ,
    {
      subName: 'Dark Brown 12mm',
      manufacturerRef: 'P-735636MK3',
      itemNumber: '917019',
      listOrder: 20,
      obsolete: false,
      unavailable: false,
      catActive: true,
      templateID: 3,
      attribName: 'Dark Brown 12mm',
      commodityCode: '91120003',
       selected: false
    }

  ];

  skusList: any[] = [];
  selectedRow: any = null; // Store the selected row
  private skusSubscription!: Subscription;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.skusSubscription = this.homeService.selectedSkU$.subscribe(skus => {
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
