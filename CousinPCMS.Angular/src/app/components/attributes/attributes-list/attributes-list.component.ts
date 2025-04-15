import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTableModule} from 'ng-zorro-antd/table';
import {AttributesService} from '../attributes.service';
import {Router} from '@angular/router';
import {DataService} from '../../../shared/services/data.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ApiResponse } from '../../../shared/models/generalModel';
import { AttributeModel } from '../../../shared/models/attributesModel';

@Component({
  selector: 'cousins-attributes-list',
  imports: [NzTableModule, NzButtonModule, FormsModule, NzIconModule, NzCheckboxModule],
  templateUrl: './attributes-list.component.html',
  styleUrl: './attributes-list.component.css',
})
export class AttributesListComponent {

  attributeList: AttributeModel[] = [];

  constructor(private attributeService: AttributesService, private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.getAllAtrributes();
  }

  getAllAtrributes() {
    this.attributeService.getAttributesList().subscribe({
      next: (response: ApiResponse<AttributeModel[]>) => {
        if (response.isSuccess) {
          this.attributeList = response.value; 
          this.attributeList.forEach((data: any, index: number) => {
              data['id'] = ++index;
          });
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
}
