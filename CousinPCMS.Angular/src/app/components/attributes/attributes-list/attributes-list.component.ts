import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AttributesService } from '../attributes.service';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ApiResponse } from '../../../shared/models/generalModel';
import { AttributeModel } from '../../../shared/models/attributesModel';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'cousins-attributes-list',
  imports: [NzTableModule, NzButtonModule, FormsModule, NzIconModule, NzCheckboxModule, NzInputModule, NzFormModule, NzPopconfirmModule, RouterLink, NzButtonModule, CommonModule, NzSpinModule,],
  templateUrl: './attributes-list.component.html',
  styleUrl: './attributes-list.component.css',
})
export class AttributesListComponent {

  attributeList: AttributeModel[] = [];
  filteredData: AttributeModel[] = [];
  searchValue: string = '';
  attributeColumns: any[][] = [];
  loading: boolean = false;
  tableRows: AttributeModel[][] = [];
  pageSize: number = 50;

  constructor(private attributeService: AttributesService, private dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.getAllAtrributes();
    sessionStorage.removeItem('attributeName');
  }

  getAllAtrributes() {
    this.loading = true;
    this.attributeService.getAttributesList().subscribe({
      next: (response: ApiResponse<AttributeModel[]>) => {
        if (response.isSuccess) {
          this.attributeList = response.value;
          this.attributeList.forEach((data: any, index: number) => {
            data['id'] = ++index;
          });
          this.filteredData = [...this.attributeList];
          this.splitIntoColumns(this.pageSize);
          this.transposeColumnsToRows()
          this.loading = false;
        } else {
          this.loading = false;
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        this.loading = false;
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  deleteAttribute(data: AttributeModel) {
    this.attributeService.deleteAttributes(data.attributeName).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Attributes Successfully Deleted');
          this.attributeList = this.attributeList.filter(d => d.id !== data.id);
          this.filteredData = [...this.attributeList];
          this.splitIntoColumns(this.pageSize);
          this.transposeColumnsToRows()
        } else {
          this.dataService.ShowNotification('error', '', 'Attributes Failed To Deleted');
        }
      },
      error: (err) => {
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      }
    });
  }

  editAttribute(data: AttributeModel) {
    sessionStorage.setItem('attributeName', data.attributeName)
    this.router.navigate(['/attributes/edit']);
  }

  onSearch() {
    const searchText = this.searchValue?.toLowerCase().replace(/\s/g, '') || '';

    if (!searchText) {
      this.filteredData = [...this.attributeList];
      return;
    }

    this.filteredData = this.attributeList.filter(item => {
      const normalize = (str: string) => str?.toLowerCase().replace(/\s/g, '') || '';

      return normalize(item.attributeName).includes(searchText) ||
        normalize(item.attributeDescription).includes(searchText) ||
        normalize(item.searchType).includes(searchText)
    });
    this.splitIntoColumns(this.pageSize);
    this.transposeColumnsToRows()
  }

  clearSearchText(): void {
    this.searchValue = '';
    this.filteredData = [...this.attributeList];
    this.splitIntoColumns(this.pageSize);
    this.transposeColumnsToRows()
  }

  splitIntoColumns(maxPerColumn: number) {
    this.attributeColumns = [];
    for (let i = 0; i < this.filteredData.length; i += maxPerColumn) {
      this.attributeColumns.push(this.filteredData.slice(i, i + maxPerColumn));
    }
  }

  transposeColumnsToRows() {
    const maxRows = Math.max(...this.attributeColumns.map(col => col.length));
    this.tableRows = [];

    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      const row: AttributeModel[] = [];
      for (let colIndex = 0; colIndex < this.attributeColumns.length; colIndex++) {
        row.push(this.attributeColumns[colIndex][rowIndex] || { attributeName: '' });
      }
      this.tableRows.push(row);
    }
  }

}
