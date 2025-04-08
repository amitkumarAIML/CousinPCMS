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
import { Router } from '@angular/router';

@Component({
  selector: 'cousins-link-maintenance',
  imports: [ReactiveFormsModule, NzInputModule, NzButtonModule, NzFormModule, NzSelectModule, NzIconModule, CommonModule, NzSpinModule],
  templateUrl: './link-maintenance.component.html',
  styleUrl: './link-maintenance.component.css',
})
export class LinkMaintenanceComponent {
  links: any[] = [];
  newLink = '';
  showForm = false;
  linkForm!: FormGroup;

  displayText: string = '';
  loading = false;
  deleteLoading = false;

  constructor(private fb: FormBuilder, private location: Location, private productService: ProductsService, private dataService: DataService,private router: Router) {
    this.linkForm = this.fb.group({
      linkText: [''],
      linkURL: [''],
      tooltip: [''],
      linkType: [''],
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
  if (currentUrl.includes('/products')) {
    this.callProductAPI();
  } else if (currentUrl.includes('/category')) {
    // this.callCategoryAPI();
  } else if (currentUrl.includes('/skus')) {
    // this.callDepartmentAPI();
  }

  }

  cancel() {
    this.showForm = false;
  }

  goBack() {
    this.location.back();
    sessionStorage.removeItem('productId');
  }

  callProductAPI() {
    this.loading = true;
    const productId = sessionStorage.getItem('productId');
    this.productService.getProductUrls(productId).subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          if (response.value && response.value.length > 0) {
            this.links = response.value;
          } else {
            this.displayText = 'No Data';
          }
        } else {
          this.displayText = 'No Data';
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.dataService.ShowNotification('error', '', 'Something went wrong');
      },
    });
  }

  save() {
    const productId = sessionStorage.getItem('productId');
    if (this.linkForm.valid) {
      const requestData = {
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

    }
  }

  onAdd() {
    this.showForm = true;
    this.linkForm.reset();
  }

  deleteLink(data: any, index: number) {
    this.deleteLoading = true;
    const req = {
      productID: data.productID,
      linkURL: data.linkURL,
    };
    this.productService.deleteProductLinkUrl(req).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.links.splice(index, 1);
          this.dataService.ShowNotification('success', '', 'Product Successfully Deleted');
        } else {
          this.dataService.ShowNotification('error', '', 'Product Details Failed Deleted');
        }
        this.deleteLoading = false;
      },
      error: (err) => {
        this.deleteLoading = false;
        if (err?.error) {
          this.dataService.ShowNotification('error', '', err.error.title);
        } else {
          this.dataService.ShowNotification('error', '', 'Something went wrong');
        }
      },
    });
  }

}
