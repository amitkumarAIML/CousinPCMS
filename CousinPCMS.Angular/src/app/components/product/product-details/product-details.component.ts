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
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { addAssociatedProductModel, AdditionalCategoryModel } from '../../../shared/models/additionalCategoryModel';
import { error } from 'jquery';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CategoryService } from '../../category/category.service';

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
              NzIconModule,
              NzUploadModule,
              NzButtonModule,
              NzSpinModule,
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
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  editAssociatedProductForm:FormGroup;
  addAssociatedProductForm:FormGroup;
  isVisibleAddProductModal:boolean=false;
  AdditionalProductList: any[] = []
  savedId: number | null = null;
  isAdditionalPloading:boolean=false;
  editingId: number | null = null;
  productId:number=0;
  categoryId:string='';
  productList:any[]=[];
  loadingProduct:boolean=false;
  akiProductID:number=0;

  @Input() productData!: any;

    constructor(private fb: FormBuilder, private productService: ProductsService, private dataService: DataService,
      private categoryService:CategoryService
    ) {
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

      this.addAssociatedProductForm=this.fb.group({
        product: [{ value: '', disabled: true },Validators.required],
        additionalCategory:[''],
        listorder:[,Validators.required],
        isAdditionalProduct: true
      });
      this.editAssociatedProductForm=this.fb.group({
        product: [],
        additionalCategory:[''],
        listOrder:[],
        isAdditionalProduct: true
      });
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['productData']) {
        if (this.productData) {
          this.productForm.patchValue(this.productData);
          console.log('product data===',this.productData.akiProductID);
          this.akiProductID=this.productData.akiProductID;
          this.categoryId=this.productData.akiCategoryID
        }
      }
    }

    ngOnInit() {
      this.getLayoutTemplate();
      this.getCommodityCodes();
      this.getCountryOrigin();
      this.getAllCategory();
      this.GetAdditionalProduct();
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
   
 // Handle File Selection
  onFileSelected(event: NzUploadChangeParam) {
    const file = event.file?.originFileObj;
      if (file) {
        this.selectedFileName = file.name;
        // Show Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
      };
      this.productForm.get('akiProductImageURL')?.setValue( this.selectedFileName); // Set it immediately

      reader.readAsDataURL(file);

      if (event.file.status === 'uploading') {
        this.dataService.ShowNotification('success','',`${event.file.name} file uploaded successfully`);
      }
      
    }
  }

  getAllProducts(){
    this.loadingProduct = true;
    this.categoryService.getAllProducts().subscribe({
      next:(response)=> {       
        this.productList=response;       
        // Filter only if AdditionalProductList is available
        if (this.AdditionalProductList && this.AdditionalProductList.length > 0) {
          const existingIds = this.AdditionalProductList.map((category: any) => category.product);
          this.productList = this.productList.filter((product: any) => !existingIds.includes(product.akiProductID));
        }
        this.loadingProduct = false; 
        console.log('data',this.productList);
                
      },error: (error) => {
        this.loadingProduct = false;
        this.dataService.ShowNotification('error', '', error.error ||'Error fetching product list data');
      }
    })
  }
  
  // GetAdditionalProduct
  GetAdditionalProduct(){
    this.isAdditionalPloading=true; 
    if (this.akiProductID) {
      const isValidProductId=this.akiProductID;
      this.productService.getAdditionalProduct(isValidProductId).subscribe({
        next: (response:any) => {
          if (response != null) {
            this.AdditionalProductList=response;           
            const maxListOrder = this.AdditionalProductList.length > 0 
              ? Math.max(...this.AdditionalProductList.map((category: any) => Number(category.listOrder) || 0)) 
              : 0;
  
            // Set the incremented value in form
            this.addAssociatedProductForm.patchValue({ listorder: maxListOrder + 1 });           
            this.getAllProducts();     
          } else {
            this.dataService.ShowNotification('error', '', 'Data are not found');                   
          }
          this.isAdditionalPloading=false;
        },error: (error) => {        
          this.dataService.ShowNotification('error', '', error.error || 'Error fetching product list data');
          this.isAdditionalPloading=false;
        }
      }); 
    }
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
   
    const isListOrderExist = this.AdditionalProductList && this.AdditionalProductList.length > 0 &&
    this.AdditionalProductList.some((category: any) => {
      return Number(category.listOrder) === listOrder;
    });

  if (isListOrderExist) {
    this.dataService.ShowNotification('error', '', 'List order already exists, please choose another number');
    this.isVisibleAddProductModal = true;
    return;
  }
 
  if(this.addAssociatedProductForm.valid){
      this.productService.addAssociatedProduct(associatedProduct).subscribe({
        next: (response:any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Associated product added successfully');
            this.GetAdditionalProduct();               
          } else {
             this.dataService.ShowNotification('error', '', 'Associated product not added ');                
          }
        },error: (error) => {        
          this.dataService.ShowNotification('error', '', 'Someting went wrong')
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
  
  selectProduct(data: any) {
    this.productId=data.akiProductID
    this.addAssociatedProductForm.patchValue({
      product: data.akiProductName, // Set Product Name
      webActive: data.akiProductIsActive // Set Web Active if required
    });    
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
     // Ensure AdditionalProductList is available before checking for duplicates
     if (!this.AdditionalProductList || this.AdditionalProductList.length === 0) {
      this.dataService.ShowNotification('error', '', 'Product list is empty. Please try again.');
      return;
    }
    // Check if listorder already exists in AdditionalCategoryList
    const isListOrderExist = this.AdditionalProductList?.some((category: any) => {
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
        this.productService.updateAssociatedProduct(associatedProduct).subscribe({
          next: (response:any) => {
            if (response.isSuccess) {
              this.dataService.ShowNotification('success', '', 'Associated product updated successfully');
              
            } else {
              this.dataService.ShowNotification('error', '', 'Associated product not updated ');                            
            }
          },error: (error) => {        
            this.dataService.ShowNotification('error', '', 'Someting went wrong');            
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

  deleteAssociatedProduct(data:any){  
    const deleteAssocatedProduct:any={
        product: data.product,
        prodCategory:data.additionalCategory,
    }
    this.categoryService.deleteAssocatedProduct(deleteAssocatedProduct).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Associaated product successfully deleted');          
        }else{
          this.dataService.ShowNotification('error', '', 'Associaated product not deleted');
        }
      },error: (error) => {
        this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
      }
    }); 
  }
}
