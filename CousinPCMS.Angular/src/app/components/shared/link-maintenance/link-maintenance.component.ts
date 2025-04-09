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
import {ApiResponse, LinkDeleteRequestModel, LinkRequestModel, LinkValue} from '../../../shared/models/linkMaintenanaceModel';

@Component({
  selector: 'cousins-link-maintenance',
  imports: [ReactiveFormsModule, NzInputModule, NzButtonModule, NzFormModule, NzSelectModule, NzIconModule, CommonModule, NzSpinModule],
  templateUrl: './link-maintenance.component.html',
  styleUrl: './link-maintenance.component.css',
})
export class LinkMaintenanceComponent {
  links: LinkValue[] = [];
  newLink = '';
  showForm = false;
  linkForm!: FormGroup;

  displayText: string = '';
  loadingdata = false;
  loading = false;
  currentUrl: string = '';
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private productService: ProductsService,
    private dataService: DataService,
    private router: Router,
    private categoryService: CategoryService
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
      this.getProductLink();
    } else if (this.currentUrl.includes('/category')) {
      this.getCategoryLink();
    } else if (this.currentUrl.includes('/skus')) {
      // this.callDepartmentAPI();
    }
  }

  cancel() {
    this.showForm = false;
  }

  goBack() {
    this.location.back();
    sessionStorage.removeItem('productId');
    sessionStorage.removeItem('categoryId');
  }

  getProductLink() {
    this.loadingdata = true;
    const productId = sessionStorage.getItem('productId');
    this.handleGetApiResponse(
      this.productService.getProductUrls(productId),
      (data) => {
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
    const categoryId = sessionStorage.getItem('categoryId');
    this.handleGetApiResponse(
      this.categoryService.getCategoryUrls(categoryId),
      (data: ApiResponse<LinkValue[]>) => {
        this.links = data.value;
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
      this.dataService.ShowNotification('error', '', 'Please fill all required fields.');
      return;
    }
    if (this.currentUrl.includes('/products')) {
      const productId = sessionStorage.getItem('productId');
      const requestData: LinkRequestModel = {
        ...this.linkForm.value,
        productID: productId,
      };
      this.loading = true;
      this.productService.saveProductLinkUrl(requestData).subscribe({
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
      const categoryId = sessionStorage.getItem('categoryId');
      const requestData: LinkRequestModel = {
        ...this.linkForm.value,
        categoryID: categoryId,
      };
      this.loading = true;
      this.categoryService.saveCategoryLinkUrl(requestData).subscribe({
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

  deleteLink(data: any, index: number) {
    this.loadingdata = true;
    if (this.currentUrl.includes('/products')) {
      const req: LinkDeleteRequestModel = {
        productID: data.productID,
        linkURL: data.linkURL,
      };
      this.productService.deleteProductLinkUrl(req).subscribe({
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
      const req: LinkDeleteRequestModel = {
        categoryID: data.categoryID,
        linkURL: data.linkURL,
      };
      this.categoryService.deleteCategoryLinkUrl(req).subscribe({
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
}
