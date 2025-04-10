import {Component} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button'; // ✅ Import ng-zorro modules
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {Subscription} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {CategoryService} from './category.service';
import {CommonModule} from '@angular/common';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {DataService} from '../../shared/services/data.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {addAssociatedProductModel, AdditionalCategoryModel, UpdateCategoryModel, categorylayout} from '../../shared/models/additionalCategoryModel';
import {CommodityCode} from '../../shared/models/commodityCodeModel';
import {Country} from '../../shared/models/countryOriginModel';
import {NzUploadChangeParam, NzUploadModule} from 'ng-zorro-antd/upload';

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
    NzDividerModule,
    RouterLink,
    NzTableModule,
    NzIconModule,
    CommonModule,
    FormsModule,
    NzModalModule,
    NzSwitchModule,
    NzSpinModule,
    NzUploadModule,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  categoryForm: FormGroup;
  private categorySubscription!: Subscription;
  categoryDetails: any;
  countries: any[] = [];
  layoutOptions: any[] = [];
  returnOptions: any[] = [];

  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  AdditionalCategoryList: AdditionalCategoryModel[] = [];
  categoryId: string = '';
  editingId: number | null = null;
  editedRow: any = {};
  editAssociatedProductForm: FormGroup;
  addAssociatedProductForm: FormGroup;
  isVisibleAddProductModal: boolean = false;
  CommodityCode: any[] = [];
  productNameList: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  loadingProduct: boolean = false;
  deleteLoading: boolean = false;
  productId: number = 0;
  savedId: number | null = null;
  isAssociatePloading: boolean = false;
  selectedFiles!: File;
  constructor(private fb: FormBuilder, private categoryService: CategoryService, private dataService: DataService, private readonly router: Router) {
    this.categoryForm = this.fb.group({
      akiCategoryID: [{value: '', disabled: true}],
      akiCategoryParentID: [{value: '', disabled: true}],
      akiCategoryName: ['', [Validators.required]],
      akiCategoryGuidePrice: [''],
      akiCategoryGuideWeight: [''],
      akiCategoryListOrder: [''],
      akiCategoryPopular: [true],
      akiCategoryImageURL: [''],
      akiCategoryImageHeight: [''],
      akiCategoryImageWidth: [''],
      akiCategoryIncludeInSearchByManufacture: [false],
      akiCategoryMinimumDigits: [{value: '', disabled: true}],
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
      akI_Indentation: [0],
      akiDepartment: [{value: '', disabled: true}],
      akIdepartmentname: [''],
      akI_Show_Category_Text: [true],
      akI_Show_Category_Image: [true],
      akI_Layout_Template: [''],
      akiCategoryWebActive: [true],
      akiCategoryDescriptionText: [''],

      akiCategoryPrintCatActive: [false],
      additionalImages: [{value: '', disabled: true}],
      urlLinks: [{value: '', disabled: true}],
    });

    this.editAssociatedProductForm = this.fb.group({
      product: [],
      additionalCategory: [''],
      listOrder: [],
      isAdditionalProduct: true,
    });
    this.addAssociatedProductForm = this.fb.group({
      product: [{value: '', disabled: true}, Validators.required],
      additionalCategory: [''],
      listorder: [, Validators.required],
      isAdditionalProduct: true,
    });
  }

  ngOnInit(): void {
    const categoryId = sessionStorage.getItem('categoryId') || '';
    this.categoryId = categoryId;
    this.getCategoryById();
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
    const updateCategory: UpdateCategoryModel = {
      akiCategoryID: this.categoryForm.get('akiCategoryID')?.value,
      akiCategoryParentID: this.categoryForm.get('akiCategoryParentID')?.value,
      akiCategoryName: this.categoryForm.get('akiCategoryName')?.value,
      akiCategoryGuidePrice: this.categoryForm.get('akiCategoryGuidePrice')?.value,
      akiCategoryGuideWeight: this.categoryForm.get('akiCategoryGuideWeight')?.value,
      akiCategoryListOrder: this.categoryForm.get('akiCategoryListOrder')?.value,
      akiCategoryPopular: this.categoryForm.get('akiCategoryPopular')?.value,
      akiCategoryImageURL: this.categoryForm.get('akiCategoryImageURL')?.value,
      akiCategoryImageHeight: this.categoryForm.get('akiCategoryImageHeight')?.value,
      akiCategoryImageWidth: this.categoryForm.get('akiCategoryImageWidth')?.value,
      akiCategoryIncludeInSearchByManufacture: this.categoryForm.get('akiCategoryIncludeInSearchByManufacture')?.value,
      akiCategoryMinimumDigits: this.categoryForm.get('akiCategoryMinimumDigits')?.value,
      akiCategoryReturnType: this.categoryForm.get('akiCategoryReturnType')?.value,
      akiCategoryShowPriceBreaks: this.categoryForm.get('akiCategoryShowPriceBreaks')?.value,
      akiCategoryCommodityCode: this.categoryForm.get('akiCategoryCommodityCode')?.value,
      akiCategoryPromptUserIfPriceGroupIsBlank: this.categoryForm.get('akiCategoryPromptUserIfPriceGroupIsBlank')?.value,
      akiCategoryCountryOfOrigin: this.categoryForm.get('akiCategoryCountryOfOrigin')?.value,
      akiCategoryTickBoxNotInUse: this.categoryForm.get('akiCategoryTickBoxNotInUse')?.value,
      akiCategoryUseComplexSearch: this.categoryForm.get('akiCategoryUseComplexSearch')?.value,
      akiCategoryDiscount: this.categoryForm.get('akiCategoryDiscount')?.value,
      akiCategoryLogInAndGreenTickOnly: this.categoryForm.get('akiCategoryLogInAndGreenTickOnly')?.value,
      akiCategoryPrintCatImage: '',
      akiCategoryPrintCatTemp: false,
      akiCategoryAlternativeTitle: this.categoryForm.get('akiCategoryAlternativeTitle')?.value,
      akiCategoryIndex1: this.categoryForm.get('akiCategoryIndex1')?.value,
      akiCategoryIndex2: this.categoryForm.get('akiCategoryIndex2')?.value,
      akiCategoryIndex3: this.categoryForm.get('akiCategoryIndex3')?.value,
      akiCategoryIndex4: this.categoryForm.get('akiCategoryIndex4')?.value,
      akiCategoryIndex5: this.categoryForm.get('akiCategoryIndex5')?.value,
      aki_Indentation: 0,
      akiDepartment: this.categoryForm.get('akiDepartment')?.value,
      akidepartmentname: '',
      aki_Show_Category_Text: this.categoryForm.get('akI_Show_Category_Text')?.value,
      aki_Show_Category_Image: this.categoryForm.get('akI_Show_Category_Image')?.value,
      aki_Layout_Template: this.categoryForm.get('akI_Layout_Template')?.value,
      akiCategoryWebActive: this.categoryForm.get('akiCategoryWebActive')?.value,
      akiCategoryDescriptionText: this.categoryForm.get('akiCategoryDescriptionText')?.value,
    };
    this.btnLoading = true;
    if (this.categoryForm.valid) {
      this.categoryService.updateCategory(updateCategory).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Category details updated successfully');
            this.btnLoading = false;
          } else {
            this.dataService.ShowNotification('error', '', 'Category details not updated ');
            this.btnLoading = false;
          }
        },
        error: (error) => {
          this.btnLoading = false;
          this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
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
      this.categoryForm.get('akiCategoryImageURL')?.setValue(this.selectedFileName); // Set it immediately

      reader.readAsDataURL(file);

      if (event.file.status === 'uploading') {
        this.dataService.ShowNotification('success', '', `${event.file.name} file uploaded successfully`);
      }
    }
  }

  deleteCategory() {
    this.deleteLoading = true;
    this.categoryService.deleteCategory(this.categoryId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Category Successfully deleted');
          this.router.navigate(['/home']);
          sessionStorage.removeItem('categoryId');
          sessionStorage.removeItem('productId');
          sessionStorage.removeItem('itemNumber');
          sessionStorage.removeItem('skuId');
          this.deleteLoading = false;
        } else {
          this.dataService.ShowNotification('error', '', 'Category not deleted');
          this.deleteLoading = false;
        }
      },
      error: (error) => {
        this.deleteLoading = false;
        this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
      },
    });
  }

  getCountryOrigin() {
    this.dataService.getCountryOrigin().subscribe({
      next: (response: Country[]) => {
        this.countries = response;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getCommodityCodes() {
    this.dataService.getCommodityCodes().subscribe({
      next: (response: CommodityCode[]) => {
        this.CommodityCode = response;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getAdditionalCategory() {
    this.isAssociatePloading = true;
    if (this.categoryId) {
      this.categoryService.getAdditionalCategory(this.categoryId).subscribe({
        next: (response: any) => {
          if (response != null) {
            this.AdditionalCategoryList = response;
            const maxListOrder = this.AdditionalCategoryList.length > 0 ? Math.max(...this.AdditionalCategoryList.map((category: any) => Number(category.listOrder) || 0)) : 0;

            // Set the incremented value in form
            this.addAssociatedProductForm.patchValue({listorder: maxListOrder + 1});
            this.getAllProducts();
          } else {
            this.dataService.ShowNotification('error', '', 'Data are not found');
          }
          this.isAssociatePloading = false;
        },
        error: (error) => {
          this.dataService.ShowNotification('error', '', error.error || 'Error fetching category list data');
          this.isAssociatePloading = false;
        },
      });
    }
  }

  getCategoryLayouts() {
    this.categoryService.getCategoryLayouts().subscribe({
      next: (response: categorylayout[]) => {
        this.layoutOptions = response;
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  getAllProducts() {
    this.loadingProduct = true;
    this.categoryService.getAllProducts().subscribe({
      next: (response) => {
        this.productNameList = response;
        // Filter only if AdditionalCategoryList is available
        if (this.AdditionalCategoryList && this.AdditionalCategoryList.length > 0) {
          const existingIds = this.AdditionalCategoryList.map((category: any) => category.product);
          this.productNameList = this.productNameList.filter((product: any) => !existingIds.includes(product.akiProductID));
        }
        this.loadingProduct = false;
      },
      error: (error) => {
        this.loadingProduct = false;
        this.dataService.ShowNotification('error', '', error.error || 'Error fetching product list data');
      },
    });
  }

  selectProduct(data: any) {
    this.productId = data.akiProductID;
    this.addAssociatedProductForm.patchValue({
      product: data.akiProductName, // Set Product Name
      webActive: data.akiProductIsActive, // Set Web Active if required
    });
  }

  addAssociatedProductSubmitForm(): void {
    this.isVisibleAddProductModal = false;
    const listOrder = Number(this.addAssociatedProductForm.get('listorder')?.value);
    if (!this.productId) {
      // Checks for null, undefined, 0, empty string, or false
      this.dataService.ShowNotification('error', '', 'Please select product name from grid');
      this.isVisibleAddProductModal = true;
      return;
    }
    const associatedProduct: addAssociatedProductModel = {
      product: this.productId,
      additionalCategory: this.categoryId,
      listorder: listOrder,
      isAdditionalProduct: true,
    };
    // Ensure AdditionalCategoryList is available before checking for duplicates
    if (!this.AdditionalCategoryList || this.AdditionalCategoryList.length === 0) {
      this.dataService.ShowNotification('error', '', 'Categories list is empty. Please try again.');
      return;
    }
    // Check if listorder already exists in AdditionalCategoryList
    const isListOrderExist = this.AdditionalCategoryList.some((category: any) => {
      return Number(category.listOrder) === listOrder; // Ensure number comparison
    });

    if (isListOrderExist) {
      this.dataService.ShowNotification('error', '', 'List order already exists, please choose another number');
      this.isVisibleAddProductModal = true;
      return; // Stop execution if listorder already exists
    } else {
      if (this.addAssociatedProductForm.valid) {
        this.categoryService.addAssociatedProduct(associatedProduct).subscribe({
          next: (response: any) => {
            if (response.isSuccess) {
              this.dataService.ShowNotification('success', '', 'Associated product added successfully');
              this.getAdditionalCategory();
            } else {
              this.dataService.ShowNotification('error', '', 'Associated product not added ');
            }
          },
          error: (error) => {
            this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
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
  }

  deleteAssociatedProduct(data: any) {
    const deleteAssocatedProduct: any = {
      product: data.product,
      prodCategory: data.additionalCategory,
    };
    this.categoryService.deleteAssocatedProduct(deleteAssocatedProduct).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.dataService.ShowNotification('success', '', 'Associaated product successfully deleted');
        } else {
          this.dataService.ShowNotification('error', '', 'Associaated product not deleted');
        }
      },
      error: (error) => {
        this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
      },
    });
  }

  startEdit(row: any) {
    this.editingId = row.product;
    this.savedId = null;
    this.editAssociatedProductForm.patchValue({
      listOrder: row.listOrder,
      product: row.product,
      additionalCategory: row.additionalCategory,
      isAdditionalProduct: row.isAdditionalProduct,
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
      isAdditionalProduct: row.isAdditionalProduct,
    };
    // Ensure AdditionalCategoryList is available before checking for duplicates
    if (!this.AdditionalCategoryList || this.AdditionalCategoryList.length === 0) {
      this.dataService.ShowNotification('error', '', 'Categories list is empty. Please try again.');
      return;
    }
    // Check if listorder already exists in AdditionalCategoryList
    const isListOrderExist = this.AdditionalCategoryList.some((category: any) => {
      return Number(category.listOrder) === listOrder; // Ensure number comparison
    });

    if (isListOrderExist) {
      this.dataService.ShowNotification('error', '', 'List order already exists, please choose another number');
      return; // Stop execution if listorder already exists
    } else {
      if (this.editAssociatedProductForm.valid) {
        this.categoryService.updateAssociatedProduct(associatedProduct).subscribe({
          next: (response: any) => {
            if (response.isSuccess) {
              this.dataService.ShowNotification('success', '', 'Associated product updated successfully');
              this.getAdditionalCategory();
            } else {
              this.dataService.ShowNotification('error', '', 'Associated product not updated ');
            }
          },
          error: (error) => {
            this.dataService.ShowNotification('error', '', error.error || 'Something went wrong');
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
    this.addAssociatedProductForm.get('product')?.value;
  }

  goToLinkMaintenance(): void {
    if (!this.categoryForm.getRawValue().akiCategoryID) return;
    this.router.navigate(['/category/link-maintenance']);
  }

  goToAdditionalImage(): void {
    if (!this.categoryForm.getRawValue().akiCategoryID) return;
    this.router.navigate(['/category/additional-images']);
  }

  getCategoryById() {
    this.loading = true;
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.categoryDetails = response.value[0];
          this.categoryForm.patchValue(this.categoryDetails);
        } else {
          this.dataService.ShowNotification('error', '', 'Failed To Load Data');
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }
}
