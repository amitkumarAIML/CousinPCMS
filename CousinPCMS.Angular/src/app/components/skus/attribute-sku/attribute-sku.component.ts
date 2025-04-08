import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'cousins-attribute-sku',
  imports: [ NzTableModule, 
             FormsModule
  ],
  templateUrl: './attribute-sku.component.html',
  styleUrl: './attribute-sku.component.css'
})
export class AttributeSkuComponent {
  linkedAttributeList: any[] = [];


}
