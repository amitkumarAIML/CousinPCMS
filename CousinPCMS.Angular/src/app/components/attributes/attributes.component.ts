import {Component, ViewChild} from '@angular/core';
import { AttributesListComponent } from "./attributes-list/attributes-list.component";
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'cousins-attributes',
  imports: [ AttributesListComponent, NzSpinModule, NzButtonModule],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.css',
})
export class AttributesComponent {

  loading: boolean = false;

 
}
