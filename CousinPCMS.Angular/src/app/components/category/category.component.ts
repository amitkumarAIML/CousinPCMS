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
import { Router, RouterLink } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CategoryService } from './category.service';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DataService } from '../../shared/services/data.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { addAssociatedProductModel, categoryListModel } from '../../shared/models/CategoryListModel';

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
    NzSwitchModule,
    NzSpinModule
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
  categoriesList: categoryListModel[] = []
  categoryId:string='';
  editingId: number | null = null;
  editedRow: any = {};
  editAssociatedProductForm:FormGroup;
  addAssociatedProductForm:FormGroup;
  isVisibleAddProductModal:boolean=false;
  CommodityCode:any[]=[];
  productNameList:any[]=[];
  loading: boolean = false;
  loadingProduct: boolean = false;
  deleteLoading: boolean = false;
  productId:number=0;

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private categoryService:CategoryService,
    private dataService : DataService,
    private readonly router: Router
  ) {
    this.categoryForm = this.fb.group({
      akiCategoryID: [{ value: '', disabled: true }],
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
      additionalImages: [{ value: '', disabled: true }],
      akiCategoryDiscount: [''],
      urlLinks: [{ value: '', disabled: true }],
      akiCategoryImageHeight: [''],
      akiCategoryImageWidth: [''],
      akiCategoryIncludeInSearchByManufacture: [false],
      akiCategoryLogInAndGreenTickOnly: [false],
      akiCategoryMinimumDigits: [{ value: '', disabled: true }],
      akiCategoryReturnType: [''],
      akiCategoryPrintCatActive: [false],
      akI_Show_Category_Text:[false],
      akI_Show_Category_Image:[false],
      akI_Layout_Template:[''],
      akiCategoryAlternativeTitle: [''],
      akiCategoryShowPriceBreaks: [false],
      akiCategoryIndex1: [''],
      akiCategoryIndex2: [''],
      akiCategoryIndex3: [''],
      akiCategoryIndex4: [''],
      akiCategoryIndex5: [''],
      akiCategoryPrintCatText:[''],
      akiCategoryPrintCatImage: [''],
      akiCategoryPrintCatTemp: true,
      akI_Indentation: 0,
      akIdepartmentname: [''],
     
    });

    this.editAssociatedProductForm = this.fb.group({
      product: [],
      additionalCategory:[''],
      listOrder:[],
      isAdditionalProduct: true
    })
    this.addAssociatedProductForm = this.fb.group({
      product: [{ value: '', disabled: true },Validators.required],
      additionalCategory:[''],
      listorder:[,Validators.required],
      isAdditionalProduct: true
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
    this.getAdditionalCategory();
    this.getCountryOrigin();
    this.getCommodityCodes();
    this.getCategoryLayouts();
    // this.getAllProducts();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
      console.log('Unsubscribed from selectedCategory$');
    }
  }
    
  submitCategoryUpdateForm(): void {
    console.log('Form Data:', this.categoryForm.getRawValue());
    this.loading = true; 
    if(this.categoryForm.valid){
      this.categoryService.updateCategory(this.categoryForm.value).subscribe({
        next: (response:any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Category details updated successfully');
            this.loading = false;      
          } else {
             this.dataService.ShowNotification('error', '', 'Category details not updated '); 
             this.loading = false;      
          }
        }, error: (error) => {
          this.loading = false;
          this.dataService.ShowNotification('error', '', error.error);
          console.error('Error fetching category details:', error.error);
        }
      });
    }else {
      Object.values(this.addAssociatedProductForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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

  deleteCategory(){ 
    this.deleteLoading = true;
    this.categoryService.deleteCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response != null) {
          this.dataService.ShowNotification('success', '', 'Category Successfully deleted');
          this.router.navigate(['/home']);
          this.deleteLoading = false;                 
        } else {
          console.log('error',response.value);       
        }
      },error: (error) => {
        this.deleteLoading = false;
        this.dataService.ShowNotification('error', '', error.error);
        console.error('Error fetching category:', error.error);
      }
    }); 
  }

  getCountryOrigin(){
    this.dataService.getCountryOrigin().subscribe({
      next:(response)=> {
        this.countries=response;
      },error(err) {
        console.log(err);        
      },
    })
  }

  getCommodityCodes(){
    this.dataService.getCommodityCodes().subscribe({
      next:(response)=> {
        this.CommodityCode=response;
      },error(err) {
        console.log(err);        
      },
    })
  }

  getAdditionalCategory() { 
    this.categoryService.getAdditionalCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response != null) {
          this.categoriesList=response;  
          console.log('categoriesList=', this.categoriesList); 
          const maxListOrder = this.categoriesList.length > 0 
            ? Math.max(...this.categoriesList.map((category: any) => Number(category.listOrder) || 0)) 
            : 0;

          // Set the incremented value in form
          this.addAssociatedProductForm.patchValue({ listorder: maxListOrder + 1 });
          this.getAllProducts();     
        } else {
          this.dataService.ShowNotification('error', '', 'Data are not found');        
        }
      },error: (error) => {        
        this.dataService.ShowNotification('error', '', error.error || 'Error fetching category list data');
        console.error('Error fetching category list data:', error.error);
      }
    }); 
  }

  getCategoryLayouts(){
    this.categoryService.getCategoryLayouts().subscribe({
      next:(response)=> {
        this.layoutOptions=response;
      },error(err) {
        console.log(err);        
      },
    })
  }

  getAllProducts(){
    this.loadingProduct = true;
    this.categoryService.getAllProducts().subscribe({
      next:(response)=> {
        this.productNameList=response;
        console.log('datawihtout filter',this.productNameList);

        // Filter only if categoriesList is available
        if (this.categoriesList && this.categoriesList.length > 0) {
          const existingIds = this.categoriesList.map((category: any) => category.product);
          this.productNameList = this.productNameList.filter((product: any) => !existingIds.includes(product.akiProductID));
        }
        this.loadingProduct = false;
        console.log('data fitter',this.productNameList);
                     
      },error: (error) => {
        this.loadingProduct = false;
        this.dataService.ShowNotification('error', '', error.error);
        console.error('Error fetching product list data:', error.error);
      }
    })
  }
  selectProduct(data: any) {
    this.productId=data.akiProductID
    this.addAssociatedProductForm.patchValue({
      product: data.akiProductName, // Set Product Name
      webActive: data.akiProductIsActive // Set Web Active if required
    });
    
  }
 
  addAssociatedProductSubmitForm(): void {
    this.isVisibleAddProductModal = false;
    const listOrder = Number(this.addAssociatedProductForm.get('listorder')?.value);  
    if (!this.productId) {  // Checks for null, undefined, 0, empty string, or false
      this.dataService.ShowNotification(
        'error',
        '',
        'Please select product name from grid'
      );
      this.isVisibleAddProductModal = true;
      return;
    }
    const associatedProduct: addAssociatedProductModel = {  
      product:this.productId ,  
      additionalCategory: this.categoryId,  
      listorder: listOrder,
      isAdditionalProduct:true 
    };
    // Ensure categoriesList is available before checking for duplicates
    if (!this.categoriesList || this.categoriesList.length === 0) {
      this.dataService.ShowNotification('error', '', 'Categories list is empty. Please try again.');
      return;
    }
    // Check if listorder already exists in categoriesList
    const isListOrderExist = this.categoriesList.some((category: any) => {
        return Number(category.listOrder) === listOrder; // Ensure number comparison
    });

    if (isListOrderExist) {
      this.dataService.ShowNotification(
        'error',
        '',
        'List order already exists, please choose another number'
      );
      this.isVisibleAddProductModal=true;
      return; // Stop execution if listorder already exists
    }else{
    if(this.addAssociatedProductForm.valid){
      this.categoryService.addAssociatedProduct(associatedProduct).subscribe({
        next: (response:any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Associated product added successfully');
            this.getAdditionalCategory();               
          } else {
             this.dataService.ShowNotification('error', '', 'Associated product not added ');                
          }
        }, error: (error) => {          
          this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
        }
      });
    }else {
      Object.values(this.addAssociatedProductForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
savedId: number | null = null;

  startEdit(row: any) {
    this.editingId = row.product;
    this.savedId = null;
    this.editAssociatedProductForm.patchValue({
      listOrder: row.listOrder,
      product: row.product,
      additionalCategory: row.additionalCategory,
      isAdditionalProduct:row.isAdditionalProduct
  });
  }

  saveEdit(row: any) {
    const listOrder = Number(this.editAssociatedProductForm.get('listOrder')?.value);  
    this.editingId = null;
    this.savedId = row.product; 
    const associatedProduct: addAssociatedProductModel = {  
      product: row.product,  
      additionalCategory: row.additionalCategory,
      listorder: listOrder,
      isAdditionalProduct:row.isAdditionalProduct  
    };
     // Ensure categoriesList is available before checking for duplicates
     if (!this.categoriesList || this.categoriesList.length === 0) {
      this.dataService.ShowNotification('error', '', 'Categories list is empty. Please try again.');
      return;
    }
    // Check if listorder already exists in categoriesList
    const isListOrderExist = this.categoriesList.some((category: any) => {
        return Number(category.listOrder) === listOrder; // Ensure number comparison
    });

    if (isListOrderExist) {
      this.dataService.ShowNotification(
        'error',
        '',
        'List order already exists, please choose another number'
      );
      return; // Stop execution if listorder already exists
    }else{      
      if(this.editAssociatedProductForm.valid){
        this.categoryService.updateAssociatedProduct(associatedProduct).subscribe({
          next: (response:any) => {
            if (response.isSuccess) {
              this.dataService.ShowNotification('success', '', 'Associated product updated successfully');
              this.getAdditionalCategory();  
                         
            } else {
              this.dataService.ShowNotification('error', '', 'Associated product not updated ');                            
            }
          }, error: (error) => {          
            this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');            
            }
        });
      }else {
        Object.values(this.editAssociatedProductForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
  }
  }

  cancelEdit() {
    this.editingId = null;
    this.savedId = null;
  }

  showAddProductModal(): void {
    this.isVisibleAddProductModal = true;
  }

  handleCancel(): void {
    this.isVisibleAddProductModal = false;
    this.addAssociatedProductForm.get('product')?.value;
  }

}
