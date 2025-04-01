import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../home/home.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'cousins-product-details',
  imports: [ FormsModule, 
            ReactiveFormsModule,
              NzFormModule,
              NzSelectModule,
              NzCheckboxModule,
              NzCardModule,
              NzDividerModule ,
              NzCardModule,
              NzTableModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  productForm: FormGroup;
  countries : any[]= [];
  layoutOptions: any[] = [];
  product = {
    heading: 'Product A',
    productText: 'This is a short description of Product A.'
  };

   constructor(private fb: FormBuilder, private homeService: HomeService) {
      this.productForm = this.fb.group({
        akiCategoryID: [''],
        akiProductCommodityCode: [],
        akiProductCountryOfOrigin: [''],
        akiProductDescription: [''],
        akiProductHeading: [''],
        akiProductID: [0],
        akiProductImageHeight: [0],
        akiProductImageURL: [''],
        akiProductImageWidth: [0],
        akiProductIndexText1: [''],
        akiProductIndexText2: [''],
        akiProductIndexText3: [''],
        akiProductIndexText4: [''],
        akiProductIndexText5: [''],
        akiProductListOrder: [0],
        akiProductName: [''],
        akiProductPrintCatActive: [false],
        akiProductPrintLayoutTemp: [false],
        akiProductPrintTitle: [null],
        akiProductShowPriceBreaks: [false],
        akiProductText: [''],
        akiProductWebActive: [true],
        category_Name: [''],
        urlLinks: ['']
      });
    }

}
