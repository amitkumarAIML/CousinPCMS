import {Component, Input, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HomeService} from '../../home/home.service';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {ProductComponent} from '../product.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ProductsService} from '../products.service';
import {DataService} from '../../../shared/services/data.service';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {Country} from '../../../shared/models/countryOriginModel';
import {CommodityCode} from '../../../shared/models/commodityCodeModel';
import {layoutProduct} from '../../../shared/models/layoutTemplateModel';
import {NzUploadChangeParam, NzUploadModule} from 'ng-zorro-antd/upload';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {AdditionalCategoryModel} from '../../../shared/models/additionalCategoryModel';
import {error} from 'jquery';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {CategoryService} from '../../category/category.service';
import {Router} from '@angular/router';
import { AdditionalProductModel, AssociatedProductRequestModelForProduct, DeleteAssociatedProductModelForProduct } from '../../../shared/models/productModel';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ProductCharLimit } from '../../../shared/char.constant';
import { CategoryAttributeComponent } from '../../home/category-attribute/category-attribute.component';

@Component({
  selector: 'cousins-product-details',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzDividerModule,
    NzCardModule,
    NzTableModule,
    NzModalModule,
    NzPaginationModule,
    NzIconModule,
    NzUploadModule,
    NzButtonModule,
    NzSpinModule,
    NzPopconfirmModule,
    CategoryAttributeComponent,
    NzIconModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  productForm: FormGroup;
  countries: Country[] = [];
  layoutOptions: layoutProduct[] = [];
  commodityCode: CommodityCode[] = [];

  isCategoryModalVisible = false;
  selectedCategoryId: string='';
  selectedCategoryName: string | null = null;

  categoryList: any[] = [];
  searchValue: string = '';
  filteredCategories: any[] = []; // Displayed data

  loading = false; // Initially false
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;

  editAssociatedProductForm: FormGroup;
  addAssociatedProductForm: FormGroup;
  isVisibleAddProductModal: boolean = false;
  AdditionalProductList: AdditionalProductModel[] = [];
  savedId: number | null = null;
  isAdditionalPloading: boolean = false;
  editingId: number | null = null;
  rowProductId: number | null=null;
  productList: any[] = [];
  loadingProduct: boolean = false;
  akiProductID: number | undefined;

  searchValueProduct: string = '';
  total = 1;
  pageSize = 10;
  pageIndex = 1;

  @Input() productData!: any;
  charLimit = ProductCharLimit;
  @Input() isSetAttributslist:any
  setAttributeName:string='';
  categoryData: any = {};

  constructor(private fb: FormBuilder, private productService: ProductsService, private dataService: DataService, private categoryService: CategoryService, private router: Router, private homeService: HomeService
  ) {
    this.productForm = this.fb.group({
      akiCategoryID: [],
      akiProductCommodityCode: [],
      akiProductCountryOfOrigin: [''],
      akiProductHeading: [''],
      akiProductID: [{value: '', disabled: true}, [Validators.required]],
      akiProductImageHeight: [0],
      akiProductImageURL: [''],
      akiProductImageWidth: [0],
      akiProductIndexText1: [''],
      akiProductIndexText2: [''],
      akiProductIndexText3: [''],
      akiProductIndexText4: [''],
      akiProductIndexText5: [''],
      akiProductListOrder: [0],
      akiProductName: ['', [Validators.required]],
      akiProductPrintLayoutTemp: [false],
      aki_Layout_Template: [''],
      akiProductAlternativeTitle: [''],
      akiProductShowPriceBreaks: [false],
      akiProductWebActive: [true],
      category_Name: [''],
      akiProductText: [''],
      akiProductIsActive: [false],
      akiProductDescription: [''],
    });

    this.addAssociatedProductForm = this.fb.group({
      product: [{value: '', disabled: true}, Validators.required],
      addproduct:[],
      listorder: [, Validators.required],
      
    });
    this.editAssociatedProductForm = this.fb.group({
      product: [],
      addproduct:[],
      listOrder: [],
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
    const akiProductIDStr = sessionStorage.getItem('productId');
    this.akiProductID = akiProductIDStr ? +akiProductIDStr : undefined;
    this.selectedCategoryId = sessionStorage.getItem('categoryId') || '';

    this.getLayoutTemplate();
    this.getCommodityCodes();
    this.getCountryOrigin();
    this.getAllCategory();
    this.getAdditionalProduct();
    this.productForm.get('akiProductName')?.disable();

    if (this.selectedCategoryId) {
      this.getDistinctAttributeSetsByCategoryId();
    }
  }

  getFormData() {
    return this.productForm.getRawValue();
  }

  getCountryOrigin() {
    this.dataService.getCountryOrigin().subscribe({
      next: (response: Country[]) => {
        this.countries = response;
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getCommodityCodes() {
    this.dataService.getCommodityCodes().subscribe({
      next: (response: CommodityCode[]) => {
        this.commodityCode = response;
      },
      error: (err) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getLayoutTemplate() {
    this.productService.getLayoutTemplateList().subscribe({
      next: (reponse: layoutProduct[]) => {
        this.layoutOptions = reponse;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getAllCategory() {
    this.loading = true; // Show loader
    this.dataService.getAllCategory().subscribe({
      next: (response) => {
        this.categoryList = response;
        this.filteredCategories = response;
        this.loading = false;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  openCategoryModal() {
    this.isCategoryModalVisible = true;
  }

  closeCategoryModal() {
    this.isCategoryModalVisible = false;
  }

  onCategorySelect(selectedCategory: any) {
    // Unselect all categories first
    this.categoryList.forEach((category) => {
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
    this.filteredCategories = this.categoryList.filter((category) => category.akiCategoryName.toLowerCase().includes(searchText));
  }

  goToLinkMaintenance(): void {
    if (!this.productForm.getRawValue().akiProductID) return;
    this.router.navigate(['/products/link-maintenance']);
  }

  goToAdditionalImage(): void {
    if (!this.productForm.getRawValue().akiProductID) return;
    this.router.navigate(['/products/additional-images']);
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
      this.productForm.get('akiProductImageURL')?.setValue(this.selectedFileName); // Set it immediately

      reader.readAsDataURL(file);

      if (event.file.status === 'uploading') {
        this.dataService.ShowNotification('success', '', 'file uploaded successfully');
      }
    }
  }

  getAllProducts() {
    this.loadingProduct = true;
    this.productService.getAllProducts(this.pageIndex, this.pageSize, this.searchValueProduct).subscribe({
      next: (response) => {
        this.productList = response.value.products;
        this.total =  response.value.totalRecords;
        // Filter only if AdditionalProductList is available
        if (this.AdditionalProductList && this.AdditionalProductList.length > 0) {
          const existingIds = this.AdditionalProductList.map((category: any) => category.additionalProduct);
          this.productList = this.productList.filter((product: any) => !existingIds.includes(product.akiProductID));
          this.total =  (response.value.totalRecords - existingIds.length);
        }
        this.loadingProduct = false;
      },
      error: (error) => {
        this.loadingProduct = false;
        this.dataService.ShowNotification('error', '', error.error || 'Error fetching product list data');
      },
    });
  }

  // GetAdditionalProduct
  getAdditionalProduct() {
    this.isAdditionalPloading = true;
    if (this.akiProductID) {
      const isValidProductId = this.akiProductID;
      this.productService.getAdditionalProduct(+isValidProductId).subscribe({
        next: (response: any) => {
          if (response != null) {
            this.AdditionalProductList = response;
            const maxListOrder = this.AdditionalProductList.length > 0 ? Math.max(...this.AdditionalProductList.map((category: any) => Number(category.listOrder) || 0)) : 0;

            // Set the incremented value in form
            this.addAssociatedProductForm.patchValue({listorder: maxListOrder + 1});
            // this.getAllProducts();
          } else {
            this.dataService.ShowNotification('error', '', 'Data are not found');
          }
          this.isAdditionalPloading = false;
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', error.error || 'Error fetching product list data');
          this.isAdditionalPloading = false;
        },
      });
    }
  }

  selectProduct(data: any) {
    this.rowProductId = data.akiProductID;
    this.addAssociatedProductForm.patchValue({
      product: data.akiProductName, // Set Product Name
      webActive: data.akiProductIsActive, // Set Web Active if required
    });
  }
  addAssociatedProductSubmitForm(): void {
    this.isVisibleAddProductModal = false;
    const listOrder = Number(this.addAssociatedProductForm.get('listorder')?.value);
    if (!this.rowProductId) {
      // Checks for null, undefined, 0, empty string, or false
      this.dataService.ShowNotification('error', '', 'Please select product name from grid');
      this.isVisibleAddProductModal = true;
      return;
    }
    
    const associatedProduct: AssociatedProductRequestModelForProduct = {
      product: this.akiProductID,
      addproduct:this.rowProductId.toString(),
      listorder: listOrder,
    };

    const isListOrderExist =
      this.AdditionalProductList &&
      this.AdditionalProductList.length > 0 &&
      this.AdditionalProductList.some((category: any) => {
        return Number(category.listOrder) === listOrder;
      });

    if (isListOrderExist) {
      this.dataService.ShowNotification('error', '', 'List order already exists, please choose another number');
      this.isVisibleAddProductModal = true;
      return;
    }

    if (this.addAssociatedProductForm.valid) {
      this.productService.addAssociatedProduct(associatedProduct).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Associated product added successfully');
            this.getAdditionalProduct();
            this.rowProductId = null
            this.addAssociatedProductForm.get('product')?.reset();
          } else {
            this.dataService.ShowNotification('error', '', 'Associated product not added ');
          }
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', 'Someting went wrong');
        },
      });
    } else {
      Object.values(this.addAssociatedProductForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  startEdit(row: any) {
    this.editingId = row.additionalProduct;
    this.savedId = null;
    this.editAssociatedProductForm.patchValue({
      listOrder: row.listOrder,
      product: row.additionalProduct,
    });
  }
  updateAssociatedProduct(row: any) {
    const listOrder = Number(this.editAssociatedProductForm.get('listOrder')?.value);
    this.editingId = null;
    this.savedId = row.additionalProduct;
    const associatedProduct: AssociatedProductRequestModelForProduct = {
      product: row.product,
      addproduct: row.additionalProduct.toString(),
      listorder: listOrder,
    };
   
    // Check if listorder already exists in AdditionalCategoryList
    const isListOrderExist = this.AdditionalProductList?.some((category: any) => {
      return Number(category.listOrder) === listOrder; // Ensure number comparison
    });

    if (isListOrderExist) {
      this.dataService.ShowNotification('error', '', 'List order already exists, please choose another number');
      return; // Stop execution if listorder already exists
    } else {
      if (this.editAssociatedProductForm.valid) {
        this.productService.updateAssociatedProduct(associatedProduct).subscribe({
          next: (response: any) => {
            if (response.isSuccess) {
              this.dataService.ShowNotification('success', '', 'Associated product updated successfully');
              this.getAdditionalProduct();
            } else {
              this.dataService.ShowNotification('error', '', 'Associated product not updated ');
            }
          },
          error: (error) => {
            this.dataService.ShowNotification('error', '', 'Someting went wrong');
          },
        });
      } else {
        Object.values(this.editAssociatedProductForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({onlySelf: true});
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
    this.addAssociatedProductForm.get('product')?.reset();
    this.rowProductId = null;
  }

  deleteAssociatedProduct(data: any) {
    const deleteAssocatedProduct: DeleteAssociatedProductModelForProduct = {
      product: data.product,
      addproduct:data.additionalProduct.toString(),
    };
    this.productService.deleteAssociatedProduct(deleteAssocatedProduct).subscribe({
      next: (response:any) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Associaated product successfully deleted');
          this.getAdditionalProduct();
        } else {
          this.dataService.ShowNotification('error', '', 'Associaated product not deleted');
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
      },
    });
  }

  clearSearchText(): void {
    this.searchValueProduct = '';
    this.pageSize = 10;
    this.pageIndex = 1;
    this.getAllProducts();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
      const { pageSize, pageIndex, sort, filter } = params;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.getAllProducts();
    }
  
    isSetAttributeVisable=false;
  goToSetAttribute(){
    this.isSetAttributeVisable=true;
    this.categoryData = this.isSetAttributslist?.[0];
  }
  btnCancel(){
    this.isSetAttributeVisable=false;

  }
  getDistinctAttributeSetsByCategoryId() {
    this.homeService.getDistinctAttributeSetsByCategoryId(this.selectedCategoryId)
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.isSetAttributslist = response.value; 
            if (Array.isArray(this.isSetAttributslist)) {
              this.setAttributeName = this.isSetAttributslist[0]?.attributeSetName || '';
              this.categoryData = this.isSetAttributslist[0];
            } else if (Array.isArray(this.isSetAttributslist.value)) {
              this.setAttributeName = this.isSetAttributslist.value[0]?.attributeSetName || '';
              this.categoryData = this.isSetAttributslist.value[0];
            } else {
              this.setAttributeName = this.isSetAttributslist?.attributeSetName || '';
              this.categoryData = this.isSetAttributslist;
            }
            
          } else {
            this.dataService.ShowNotification('error', '','Failed to load attribute sets');
          }
        },
        error: (error) => {
         this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
        }
      });
  }

}
