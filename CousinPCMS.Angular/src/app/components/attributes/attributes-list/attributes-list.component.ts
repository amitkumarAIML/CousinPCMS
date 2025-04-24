import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTableModule} from 'ng-zorro-antd/table';
import {AttributesService} from '../attributes.service';
import {Router, RouterLink} from '@angular/router';
import {DataService} from '../../../shared/services/data.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ApiResponse } from '../../../shared/models/generalModel';
import { AttributeModel } from '../../../shared/models/attributesModel';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'cousins-attributes-list',
  imports: [NzTableModule, NzButtonModule, FormsModule, NzIconModule, NzCheckboxModule, NzInputModule, NzFormModule, NzPopconfirmModule,RouterLink, NzButtonModule],
  templateUrl: './attributes-list.component.html',
  styleUrl: './attributes-list.component.css',
})
export class AttributesListComponent {

  attributeList: AttributeModel[] = [];
  filteredData: AttributeModel[] = [];
  searchValue: string = '';

  constructor(private attributeService: AttributesService, private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.getAllAtrributes();
    sessionStorage.removeItem('attributeName');
  }

  getAllAtrributes() {
    this.attributeService.getAttributesList().subscribe({
      next: (response: ApiResponse<AttributeModel[]>) => {
        if (response.isSuccess) {
          this.attributeList = response.value; 
          this.attributeList.forEach((data: any, index: number) => {
              data['id'] = ++index;
          });
          this.filteredData = [...this.attributeList];
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
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

  editAttribute(data:AttributeModel) {
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
      
      return  normalize(item.attributeName).includes(searchText)||
              normalize(item.attributeDescription).includes(searchText) || 
              normalize(item.searchType).includes(searchText)
    }); 
  }
  
  clearSearchText(): void {
    this.searchValue = '';
    this.filteredData = [...this.attributeList];
  }
 
}
