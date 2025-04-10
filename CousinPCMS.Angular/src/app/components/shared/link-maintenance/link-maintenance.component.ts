import {CommonModule, Location} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {ProductsService} from '../../product/products.service';
import {DataService} from '../../../shared/services/data.service';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CategoryService} from '../../category/category.service';
import { LinkDeleteRequestModel, LinkRequestModel, LinkValue} from '../../../shared/models/linkMaintenanaceModel';
import { ApiResponse } from '../../../shared/models/generalModel';
import { SkusService } from '../../skus/skus.service';

@Component({
  selector: 'cousins-link-maintenance',
  imports: [ReactiveFormsModule, NzInputModule, NzButtonModule, NzFormModule, NzSelectModule, NzIconModule, CommonModule, NzSpinModule],
  templateUrl: './link-maintenance.component.html',
  styleUrl: './link-maintenance.component.css',
})
export class LinkMaintenanceComponent {

  links: LinkValue[] = [];
  showForm = false;
  linkForm!: FormGroup;

  displayText: string = '';
  loadingdata: boolean = false;
  loading: boolean = false;
  currentUrl: string = '';
  isDuplicateUrl = false;

  productId!: number | undefined;
  categoryId!: string | undefined;
  skuId!: string | undefined;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private productService: ProductsService,
    private dataService: DataService,
    private router: Router,
    private categoryService: CategoryService,
    private skusService: SkusService
  ) {
    this.linkForm = this.fb.group({
      linkText: ['', [Validators.required]],
      linkURL: ['', [Validators.required]],
      tooltip: ['', [Validators.required]],
      linkType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.currentUrl.includes('/products')) {
      const productIdStr = sessionStorage.getItem('productId');
      const productId: number | undefined = productIdStr ? +productIdStr : undefined;
      this.productId = productId;
      this.getProductLink();
    } else if (this.currentUrl.includes('/category')) {
      const categoryIdStr = sessionStorage.getItem('categoryId');
      const categoryId: string | undefined = categoryIdStr ? categoryIdStr : undefined;
      this.categoryId = categoryId;
      this.getCategoryLink();
    } else if (this.currentUrl.includes('/skus')) {
      const skuIdStr = sessionStorage.getItem('skuId');
      const skuId: string | undefined = skuIdStr ? skuIdStr : undefined;
      this.skuId = skuId;
      this.getSkusLink();
    }
  }

  cancel() {
    this.showForm = false;
  }

  goBack() {
    this.location.back();
    // sessionStorage.removeItem('productId');
    // sessionStorage.removeItem('categoryId');
    // sessionStorage.removeItem('skuId');
    
  }

  getProductLink() {
    this.loadingdata = true;
    const productId = sessionStorage.getItem('productId');
    this.handleGetApiResponse<ApiResponse<LinkValue[]>>(
      this.productService.getProductUrls(this.productId),
      (data: any) => {
        this.links = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
    
  }

  getCategoryLink() {
    this.loadingdata = true;
    this.handleGetApiResponse<ApiResponse<LinkValue[]>>(
      this.categoryService.getCategoryUrls(this.categoryId),
      (data: any) => {
        this.links = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
  }

  getSkusLink() {
    this.loadingdata = true;
    this.handleGetApiResponse<ApiResponse<LinkValue[]>>(
      this.skusService.getSkuUrls(this.skuId),
      (data: any) => {
        this.links = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
  }

  save() {
    if (!this.linkForm.valid) {
      this.dataService.ShowNotification('error', '', 'Please fill in all required fields.');
      return; // Stop the save process
    }
    const requestData: LinkRequestModel = {
      ...this.linkForm.value,
    };
    if (this.currentUrl.includes('/products')) {
      this.loading = true;
      this.productService.saveProductLinkUrl({ ... requestData, productID: this.productId}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'LinkUrl Added Successfully');
            this.links.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'LinkUrl Failed Add');
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
    } else if (this.currentUrl.includes('/category')) {
      this.loading = true;
      this.categoryService.saveCategoryLinkUrl({ ... requestData, categoryID: this.categoryId}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'LinkUrl Added Successfully');
            this.links.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'LinkUrl Failed Add');
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
    } else if (this.currentUrl.includes('/skus')) {
      this.loading = true;
      this.skusService.saveSkuLinkUrl({ ... requestData, skuItemID: this.skuId}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'LinkUrl Added Successfully');
            this.links.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'LinkUrl Failed Add');
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

  onAdd() {
    this.showForm = true;
    this.linkForm.reset();
  }

  deleteLink(data: LinkRequestModel, index: number) {
    this.loadingdata = true;
    const req: LinkDeleteRequestModel = {
      linkURL: data.linkURL,
    };
    if (this.currentUrl.includes('/products')) {
      this.productService.deleteProductLinkUrl({...req, productID: data.productID, }).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.links.splice(index, 1);
            this.dataService.ShowNotification('success', '', 'Product Successfully Deleted');
          } else {
            this.dataService.ShowNotification('error', '', 'Product Url Failed Deleted');
          }
          this.loadingdata = false;
        },
        error: (err) => {
          this.loadingdata = false;
          if (err?.error) {
            this.dataService.ShowNotification('error', '', err.error.title);
          } else {
            this.dataService.ShowNotification('error', '', 'Something went wrong');
          }
        },
      });
    } else if (this.currentUrl.includes('/category')) {
      this.categoryService.deleteCategoryLinkUrl({...req,  categoryID: data.categoryID,}).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.links.splice(index, 1);
            this.dataService.ShowNotification('success', '', 'Category Successfully Deleted');
          } else {
            this.dataService.ShowNotification('error', '', 'Category Url Failed Deleted');
          }
          this.loadingdata = false;
        },
        error: (err) => {
          this.loadingdata = false;
          if (err?.error) {
            this.dataService.ShowNotification('error', '', err.error.title);
          } else {
            this.dataService.ShowNotification('error', '', 'Something went wrong');
          }
        },
      });
    } else if (this.currentUrl.includes('/skus')) {
      this.skusService.deleteSkuLinkUrl({...req, skuItemID: data.skuItemID}).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.links.splice(index, 1);
            this.dataService.ShowNotification('success', '', 'Category Successfully Deleted');
          } else {
            this.dataService.ShowNotification('error', '', 'Category Url Failed Deleted');
          }
          this.loadingdata = false;
        },
        error: (err) => {
          this.loadingdata = false;
          if (err?.error) {
            this.dataService.ShowNotification('error', '', err.error.title);
          } else {
            this.dataService.ShowNotification('error', '', 'Something went wrong');
          }
        },
      });
    }
  } 

  handleGetApiResponse<T>(
    observable: Observable<T>,
    onSuccess: (data: T) => void,
    context: {
      loadingRef?: (state: boolean) => void;
      emptyCheck?: (data: any) => boolean;
      emptyMessage?: string;
      onEmpty?: () => void;
      onError?: () => void;
      notifyOnError?: boolean;
    } = {}
  ) {
    if (context.loadingRef) context.loadingRef(true);

    observable.subscribe({
      next: (response: any) => {
        if (context.loadingRef) context.loadingRef(false);

        if (response.isSuccess) {
          if (context.emptyCheck && context.emptyCheck(response.value)) {
            if (context.onEmpty) context.onEmpty();
          } else {
            onSuccess(response.value);
          }
        } else {
          if (context.onEmpty) context.onEmpty();
          if (context.notifyOnError) this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
      error: (err) => {
        if (context.loadingRef) context.loadingRef(false);
        if (context.onError) context.onError();
        if (context.notifyOnError) this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  checkDuplicateUrl(): void {
    const inputValue = this.linkForm.get('linkURL')?.value?.trim().toLowerCase();
  
    this.isDuplicateUrl = this.links.some(link =>
      link.linkURL?.trim().toLowerCase() === inputValue
    );
  }
}
