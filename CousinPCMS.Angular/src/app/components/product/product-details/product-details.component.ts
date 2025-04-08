import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HomeService } from '../../home/home.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProductComponent } from '../product.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProductsService } from '../products.service';
import { DataService } from '../../../shared/services/data.service';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Country } from '../../../shared/models/countryOriginModel';
import { CommodityCode } from '../../../shared/models/commodityCodeModel';
import { layoutDepartment, layoutProduct } from '../../../shared/models/layoutTemplateModel';

@Component({
  selector: 'cousins-product-details',
  imports: [  FormsModule, 
              ReactiveFormsModule,
              NzInputModule,
              NzFormModule,
              NzSelectModule,
              NzCheckboxModule,
              NzCardModule,
              NzDividerModule ,
              NzCardModule,
              NzTableModule,
              NzModalModule,
              NzPaginationModule,
              NzIconModule
            ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {

  productForm: FormGroup;
  countries : Country[]= [];
  layoutOptions: layoutProduct[] = [];
  commodityCode: CommodityCode[] = [];

  isCategoryModalVisible = false;
  selectedCategoryId: string | null = null;
  selectedCategoryName: string | null = null;

  categoryList: any[] = [];
  searchValue: string = '';
  filteredCategories: any[] = []; // Displayed data

  loading = false; // Initially false

  @Input() productData!: any;

    constructor(private fb: FormBuilder, private productService: ProductsService, private dataService: DataService) {
      this.productForm = this.fb.group({
        akiCategoryID: [],
        akiProductCommodityCode: [],
        akiProductCountryOfOrigin: [''],
        akiProductHeading: [''],
        akiProductID: [{ value: '' , disabled: true}, [Validators.required]],
        akiProductImageHeight: [0],
        akiProductImageURL: [''],
        akiProductImageWidth: [0],
        akiProductIndexText1: [''],
        akiProductIndexText2: [''],
        akiProductIndexText3: [''],
        akiProductIndexText4: [''],
        akiProductIndexText5: [''],
        akiProductListOrder: [0],
        akiProductName: ['',[ Validators.required ]],
        akiProductPrintLayoutTemp: [false],
        aki_Layout_Template: [''],
        akiProductAlternativeTitle: [''],
        akiProductShowPriceBreaks: [false],
        akiProductWebActive: [true],
        category_Name: [''],
        akiProductText: [''],
        
        akiProductDescription: [''],

      });
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['productData']) {
        if (this.productData) {
          this.productForm.patchValue(this.productData);
        }
      }
    }

    ngOnInit() {
      this.getLayoutTemplate();
      this.getCommodityCodes();
      this.getCountryOrigin();
      this.getAllCategory();
    }

    getFormData() {
      return this.productForm.getRawValue();
    }

    getCountryOrigin(){
      this.dataService.getCountryOrigin().subscribe({
        next:(response: Country[])=> {
          this.countries = response;
        },
        error: (err) => {
          this.dataService.ShowNotification('error', '', 'Something went wrong');  
        },
      })
    }
  
    getCommodityCodes(){
      this.dataService.getCommodityCodes().subscribe({
        next:(response: CommodityCode[])=> {
          this.commodityCode = response;
        },
        error: (err) => {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        },
      })
    }

    getLayoutTemplate() {
      this.productService.getLayoutTemplateList().subscribe({
        next: (reponse: layoutProduct[]) => {
          this.layoutOptions = reponse;
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      });
    } 

    getAllCategory() {
      this.loading = true; // Show loader
      this.dataService.getAllCategory().subscribe({
        next:(response)=> {
          this.categoryList = response;
          this.filteredCategories = response; 
          this.loading = false; 
        },error(err) {
          console.log(err);       
        },
      })
    }
    
    openCategoryModal() {
      this.isCategoryModalVisible = true;
    }
  
    closeCategoryModal() {
      this.isCategoryModalVisible = false;
    }

    onCategorySelect(selectedCategory: any) {
      // Unselect all categories first
      this.categoryList.forEach(category => {
        if (category.akiCategoryID !== selectedCategory.akiCategoryID) {
          category.selected = false;
        }
      });
  
      // Set the selected category
      this.productForm.get('akiCategoryID')?.setValue(selectedCategory.selected ? selectedCategory.akiCategoryID : null);
      this.productForm.get('category_Name')?.setValue(selectedCategory.selected ? selectedCategory.akiCategoryName : null);
    }
  
    selectCategory() {
      this.isCategoryModalVisible = false;
    }

    // Search filter function
    onSearch() {
      const searchText = this.searchValue.toLowerCase();
      this.filteredCategories = this.categoryList.filter(category =>
        category.akiCategoryName.toLowerCase().includes(searchText)
      );
    }

   

}
