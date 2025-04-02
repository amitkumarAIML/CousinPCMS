import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button'; // ✅ Import ng-zorro modules
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Subscription } from 'rxjs';
import { HomeService } from '../home/home.service';
import { RouterLink } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CategoryService } from '../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CategoryListModel } from '../../shared/models/CategoryListModel';
@Component({
  selector: 'cousins-category',
  imports: [ 
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule ,
    NzCardModule,
    RouterLink,
    NzTableModule,
    NzIconModule,
    CommonModule,
    FormsModule,
    NzModalModule,
    NzSwitchModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  categoryForm: FormGroup;
  private categorySubscription!: Subscription;
  categoryDetails: any;
  countries : any[]= []
  layoutOptions: any[] = [];
  returnOptions: any[] = [];

  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  categoriesList: CategoryListModel[] = []
  categoryId:string='';
  editingId: number | null = null;
  editedRow: any = {};
  editCategoryProductForm:FormGroup;
  addCategoryProductForm:FormGroup;
  isVisibleAddProductModal:boolean=false;
  CommodityCode:any[]=[];

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private categoryService:CategoryService
  ) {
    this.categoryForm = this.fb.group({
      akiCategoryID: [{ value: '', disabled: true }],
      akiCategoryParentID: [{ value: '', disabled: true }],
      akiDepartment: [{ value: '', disabled: true }],
      akiCategoryName: ['', [Validators.required]],
      akiCategoryGuidePrice: [''],
      akiCategoryGuideWeight: [''],
      akiCategoryCommodityCode: [''],
      akiCategoryListOrder: [''],
      akiCategoryPromptUserIfPriceGroupIsBlank: [false],
      akiCategoryCountryOfOrigin: [''],
      akiCategoryWebActive: [false],
      akiCategoryPopular: [false],
      akiCategoryTickBoxNotInUse: [false],
      akiCategoryUseComplexSearch: [false],
      akiCategoryDescriptionText: [''],
      akiCategoryImageURL: [''],
      additionalImages: [''],
      akiCategoryDiscount: [''],
      urlLinks: [''],
      akiCategoryImageHeight: [''],
      akiCategoryImageWidth: [''],
      akiCategoryIncludeInSearchByManufacture: [false],
      akiCategoryLogInAndGreenTickOnly: [false],
      akiCategoryMinimumDigits: [{ value: '', disabled: true }],
      akiCategoryReturnType: [''],
      akiCategoryPrintCatActive: [false],
      showCategoryText: [false],
      showCategoryImage: [false],
      layoutTemplate: [''],
      alternativeTitle: [''],
      akiCategoryShowPriceBreaks: [false],
      akiCategoryIndex1: [''],
      akiCategoryIndex2: [''],
      akiCategoryIndex3: [''],
      akiCategoryIndex4: [''],
      akiCategoryIndex5: ['']
    });

    this.editCategoryProductForm = this.fb.group({
      listOrder:[],
      webActive:[true],
      productName:[''],
      product:[],
      categoryName:[],
      additionalCategory:[],
      oDataEtag:[],
    })
    this.addCategoryProductForm = this.fb.group({
      listOrder:[],
      webActive:[true],
      productName:[''],
      product:[],
      categoryName:[],
      additionalCategory:[],
      oDataEtag:[],
    })
  }

  ngOnInit(): void {
    this.categorySubscription = this.homeService.selectedCategory$.subscribe(category => {
      if (category) {
        this.categoryDetails = category[0];
        this.categoryForm.patchValue(this.categoryDetails);
        this.categoryId=this.categoryDetails.akiCategoryID
        console.log('Received Category:', category);
      }
    });
    this.GetAdditionalCategory();
    this.GetCountryOrigin();
    this.GetCommodityCodes();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
      console.log('Unsubscribed from selectedCategory$');
    }
  }
    
  submitForm(): void {
    console.log('Form Data:', this.categoryForm.value);
  }

   // Handle File Selection
   onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectedFileName = file.name;

      // Show Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  DeleteCategory(){
    this.categoryService.DeleteCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response != null) {
          console.log('deleted successfully');                  
        } else {
          console.log('error',response.value);       
        }
      },error(err) {
        console.log('something went wrong',err);
      },
    }); 
  }

  GetCountryOrigin(){
    this.categoryService.GetCountryOrigin().subscribe({
      next:(response)=> {
        this.countries=response;
      },error(err) {
        console.log(err);        
      },
    })
  }

  GetCommodityCodes(){
    this.categoryService.GetCommodityCodes().subscribe({
      next:(response)=> {
        this.CommodityCode=response;
      },error(err) {
        console.log(err);        
      },
    })
  }
  GetAdditionalCategory() { 
    this.categoryService.GetAdditionalCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response != null) {
          this.categoriesList=response;         
        } else {
          console.log('error',response.value);       
        }
      },error(err) {
        console.log('something went wrong',err);
      },
    }); 
  }

  startEdit(row: any) {
    this.editingId = row.listOrder;
    this.editCategoryProductForm.patchValue({
      listOrder: row.listOrder,
      productName: row.productName,
      webActive: row.webActive
    });
  }

  saveEdit(row: any) {
    Object.assign(row, this.editedRow);
    this.editingId = null;
  }

  cancelEdit() {
    this.editingId = null;
  }

  showAddProductModal(): void {
    this.isVisibleAddProductModal = true;
  }

  addCategoryProductSubmitForm(): void {
    this.isVisibleAddProductModal = false;
    if(this.addCategoryProductForm.valid){

    }else {
      Object.values(this.addCategoryProductForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisibleAddProductModal = false;
  }

}
