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
import { addAssociatedProductModel, categoryDetailUpdatedModel, categoryListModel } from '../../shared/models/CategoryListModel';

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
  savedId: number | null = null;

  constructor(private fb: FormBuilder, private homeService: HomeService,
    private categoryService:CategoryService,
    private dataService : DataService,
    private readonly router: Router
  ) {
    this.categoryForm = this.fb.group({
      akiCategoryID: [{ value: '', disabled: true }],
      akiCategoryParentID:[''],
      akiCategoryName: ['', [Validators.required]],
      akiCategoryGuidePrice: [''],
      akiCategoryGuideWeight:[''],
      akiCategoryListOrder: [''],      
      akiCategoryPopular: [true],
      akiCategoryImageURL: [''],
      akiCategoryImageHeight: [''],
      akiCategoryImageWidth: [''],
      akiCategoryIncludeInSearchByManufacture: [false],
      akiCategoryMinimumDigits: [{ value: '', disabled: true }],
      akiCategoryReturnType: [null],      
      akiCategoryShowPriceBreaks: [true],      
      akiCategoryCommodityCode: [''],
      akiCategoryPromptUserIfPriceGroupIsBlank: [true],      
      akiCategoryCountryOfOrigin: [''],
      akiCategoryTickBoxNotInUse: [true],
      akiCategoryUseComplexSearch: [true],      
      akiCategoryDiscount: [0],
      akiCategoryLogInAndGreenTickOnly: [false],
      akiCategoryPrintCatImage: [''],      
      akiCategoryPrintCatTemp: [true],
      akiCategoryAlternativeTitle: [''],
      akiCategoryIndex1: [''],
      akiCategoryIndex2: [''],
      akiCategoryIndex3: [''],
      akiCategoryIndex4: [''],
      akiCategoryIndex5: [''],
      akI_Indentation:[0],
      akiDepartment: [{ value: '', disabled: true }],
      akIdepartmentname:[''], 
      akI_Show_Category_Text:[true],
      akI_Show_Category_Image:[true],
      akI_Layout_Template:[''],
      akiCategoryWebActive: [true],
      akiCategoryDescriptionText: [''],

      akiCategoryPrintCatActive: [false],
      additionalImages: [{ value: '', disabled: true }],     
      urlLinks: [{ value: '', disabled: true }],     
      
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
      }
    });
    this.getAdditionalCategory();
    this.getCountryOrigin();
    this.getCommodityCodes();
    this.getCategoryLayouts();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }
    
  submitCategoryUpdateForm(): void {

    const updateCategory:categoryDetailUpdatedModel={
      akiCategoryID: this.categoryForm.get('akiCategoryID')?.value,
      akiCategoryParentID:'',
      akiCategoryName:this.categoryForm.get('akiCategoryName')?.value,
      akiCategoryGuidePrice:this.categoryForm.get('akiCategoryGuidePrice')?.value,
      akiCategoryGuideWeight: this.categoryForm.get('akiCategoryGuideWeight')?.value,     
      akiCategoryListOrder: this.categoryForm.get('akiCategoryListOrder')?.value,
      akiCategoryPopular: this.categoryForm.get('akiCategoryPopular')?.value,
      akiCategoryImageURL: this.categoryForm.get('akiCategoryImageURL')?.value,
      akiCategoryImageHeight:this.categoryForm.get('akiCategoryImageHeight')?.value,
      akiCategoryImageWidth:this.categoryForm.get('akiCategoryImageWidth')?.value,
      akiCategoryIncludeInSearchByManufacture: this.categoryForm.get('akiCategoryIncludeInSearchByManufacture')?.value,
      akiCategoryMinimumDigits:this.categoryForm.get('akiCategoryMinimumDigits')?.value,
      akiCategoryReturnType:this.categoryForm.get('akiCategoryReturnType')?.value,
      akiCategoryShowPriceBreaks: this.categoryForm.get('akiCategoryShowPriceBreaks')?.value,
      akiCategoryCommodityCode:this.categoryForm.get('akiCategoryCommodityCode')?.value,
      akiCategoryPromptUserIfPriceGroupIsBlank:this.categoryForm.get('akiCategoryPromptUserIfPriceGroupIsBlank')?.value,
      akiCategoryCountryOfOrigin: this.categoryForm.get('akiCategoryCountryOfOrigin')?.value,
      akiCategoryTickBoxNotInUse: this.categoryForm.get('akiCategoryTickBoxNotInUse')?.value,
      akiCategoryUseComplexSearch: this.categoryForm.get('akiCategoryUseComplexSearch')?.value,
      akiCategoryDiscount: this.categoryForm.get('akiCategoryDiscount')?.value,
      akiCategoryLogInAndGreenTickOnly: this.categoryForm.get('akiCategoryLogInAndGreenTickOnly')?.value,
      akiCategoryPrintCatImage: '',
      akiCategoryPrintCatTemp: false,
      akiCategoryAlternativeTitle: this.categoryForm.get('akiCategoryAlternativeTitle')?.value,
      akiCategoryIndex1:  this.categoryForm.get('akiCategoryIndex1')?.value,
      akiCategoryIndex2:  this.categoryForm.get('akiCategoryIndex2')?.value,
      akiCategoryIndex3:  this.categoryForm.get('akiCategoryIndex3')?.value,
      akiCategoryIndex4:  this.categoryForm.get('akiCategoryIndex4')?.value,
      akiCategoryIndex5:  this.categoryForm.get('akiCategoryIndex5')?.value,
      aki_Indentation: 0,
      akiDepartment: this.categoryForm.get('akiDepartment')?.value,
      akidepartmentname:'' ,
      aki_Show_Category_Text: this.categoryForm.get('akI_Show_Category_Text')?.value,
      aki_Show_Category_Image: this.categoryForm.get('akI_Show_Category_Image')?.value,
      aki_Layout_Template: this.categoryForm.get('akI_Layout_Template')?.value,
      akiCategoryWebActive: this.categoryForm.get('akiCategoryWebActive')?.value,
      akiCategoryDescriptionText:this.categoryForm.get('akiCategoryDescriptionText')?.value 
    }      
    this.loading = true; 
    if(this.categoryForm.valid){
      this.categoryService.updateCategory(updateCategory).subscribe({
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
        if (response) {
          this.dataService.ShowNotification('success', '', 'Category Successfully deleted');
          this.router.navigate(['/home']);
          this.deleteLoading = false;                     
        }
      },error: (error) => {
        this.deleteLoading = false;
        this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
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
    if (this.categoryId) {
      this.categoryService.getAdditionalCategory(this.categoryId).subscribe({
        next: (response) => {
          if (response != null) {
            this.categoriesList=response;           
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
        }
      }); 
    }
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
        // Filter only if categoriesList is available
        if (this.categoriesList && this.categoriesList.length > 0) {
          const existingIds = this.categoriesList.map((category: any) => category.product);
          this.productNameList = this.productNameList.filter((product: any) => !existingIds.includes(product.akiProductID));
        }
        this.loadingProduct = false;         
      },error: (error) => {
        this.loadingProduct = false;
        this.dataService.ShowNotification('error', '', error.error ||'Error fetching product list data');
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

  saveAssociatedProEdit(row: any) {
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
