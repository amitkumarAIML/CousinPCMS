import {CommonModule, Location} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzUploadChangeParam, NzUploadFile, NzUploadModule} from 'ng-zorro-antd/upload';
import {Observable, Observer} from 'rxjs';
import {ProductsService} from '../../product/products.service';
import {DataService} from '../../../shared/services/data.service';
import {CategoryService} from '../../category/category.service';
import {ApiResponse} from '../../../shared/models/generalModel';
import {AdditionalImagesModel, AdditionalImageDeleteRequestModel} from '../../../shared/models/additionalImagesModel';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {SkusService} from '../../skus/skus.service';

@Component({
  selector: 'cousins-additional-images',
  imports: [FormsModule, NzInputModule, NzButtonModule, NzFormModule, NzUploadModule, NzIconModule, CommonModule, NzSpinModule],
  templateUrl: './additional-images.component.html',
  styleUrl: './additional-images.component.css',
})
export class AdditionalImagesComponent {
  fileList: AdditionalImagesModel[] = [];

  showForm: boolean = false;
  imageUrl!: string;
  loading: boolean = false;
  avatarUrl?: string | ArrayBuffer | null = null;
  currentUrl: string = '';
  displayText: string = '';
  loadingdata: boolean = false;

  productId!: number | undefined;
  categoryId!: string | undefined;
  skuId!: string | undefined;
  isDuplicateUrl = false;

  constructor(
    private location: Location,
    private router: Router,
    private productService: ProductsService,
    private dataService: DataService,
    private categoryService: CategoryService,
    private skusService: SkusService
  ) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.currentUrl.includes('/products')) {
      const productIdStr = sessionStorage.getItem('productId');
      const productId: number | undefined = productIdStr ? +productIdStr : undefined;
      this.productId = productId;
      this.getProductImages();
    } else if (this.currentUrl.includes('/category')) {
      const categoryIdStr = sessionStorage.getItem('categoryId');
      const categoryId: string | undefined = categoryIdStr ? categoryIdStr : undefined;
      this.categoryId = categoryId;
      this.getCategoryImages();
    } else if (this.currentUrl.includes('/skus')) {
      const skuIdStr = sessionStorage.getItem('skuId');
      const skuId: string | undefined = skuIdStr ? skuIdStr : undefined;
      this.skuId = skuId;
      this.getSkusImages();
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

  onAdd() {
    (this.avatarUrl = ''), (this.imageUrl = '');
    this.showForm = true;
  }

  getProductImages() {
    this.loadingdata = true;
    this.handleGetApiResponse<ApiResponse<AdditionalImagesModel[]>>(
      this.productService.getGetProductAdditionalImages(this.productId),
      (data: any) => {
        this.fileList = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
  }

  getCategoryImages() {
    this.loadingdata = true;
    this.handleGetApiResponse<ApiResponse<AdditionalImagesModel[]>>(
      this.categoryService.getGetCategoryAdditionalImages(this.categoryId),
      (data: any) => {
        this.fileList = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
  }

  getSkusImages() {
    this.loadingdata = true;
    this.handleGetApiResponse<ApiResponse<AdditionalImagesModel[]>>(
      this.skusService.getSkuAdditionalImages(this.skuId),
      (data: any) => {
        this.fileList = data;
      },
      {
        loadingRef: (state) => (this.loadingdata = state),
        emptyCheck: (data) => !data || data.length === 0,
        onEmpty: () => (this.displayText = 'No Data'),
        notifyOnError: true,
      }
    );
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

  deleteImage(data: AdditionalImagesModel, index: number) {
    this.loadingdata = true;
    const req: AdditionalImageDeleteRequestModel = {
      imageURL: data.imageURL,
    };
    if (this.currentUrl.includes('/products')) {
      this.productService.deleteProductImagesUrl({...req, productID: data.productID}).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.fileList.splice(index, 1);
            this.dataService.ShowNotification('success', '', 'Product image Successfully Deleted');
          } else {
            this.dataService.ShowNotification('error', '', 'Product images Failed Deleted');
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
      this.categoryService.deleteCategoryImagesUrl({...req, categoryID: data.categoryID}).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.fileList.splice(index, 1);
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
      this.skusService.deleteSkuImagesUrl({...req, skuItemID: data.skuItemID}).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.fileList.splice(index, 1);
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

  uploadFile() {
    if (!this.imageUrl) {
      this.dataService.ShowNotification('error', '', 'Please select file.');
      return; // Stop the save process
    }
    const requestData: AdditionalImagesModel = {
      imageURL: this.imageUrl,
      imagename: this.imageUrl.replace(/\.png$/i, ''),
    };
    if (this.currentUrl.includes('/products')) {
      this.loading = true;
      this.productService.saveProductImagesUrl({...requestData, productID: this.productId}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Image Added Successfully');
            this.fileList.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'Image Failed Add');
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
      this.categoryService.saveCategoryImagesUrl({...requestData, categoryID: this.categoryId,}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Image Added Successfully');
            this.fileList.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'Image Failed Add');
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
      this.skusService.saveSkuImagesUrl({...requestData, skuItemID: this.skuId,}).subscribe({
        next: (response: any) => {
          if (response.isSuccess) {
            this.dataService.ShowNotification('success', '', 'Image Added Successfully');
            this.fileList.push(requestData);
            this.showForm = false;
          } else {
            this.dataService.ShowNotification('error', '', 'Image Failed Add');
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

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUrl = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result;
        this.imageUrl = file.name;
      };
      const inputValue = this.imageUrl?.trim().toLowerCase();
      this.isDuplicateUrl = this.fileList.some((file) => file.imageURL?.trim().toLowerCase() === inputValue);
      reader.readAsDataURL(file as unknown as File); // force cast for FileReader
    }
  }

  compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 200;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // quality 70%
        };
      };
      reader.readAsDataURL(file);
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    const rawFile = file as any;
    const inputValue = file.name?.trim().toLowerCase();
    this.isDuplicateUrl = this.fileList.some((file) => file.imageURL?.trim().toLowerCase() === inputValue);

    this.compressImage(rawFile as File).then((compressedBase64: string) => {
      this.avatarUrl = compressedBase64;
      this.imageUrl = file.name;
    });
    return false; // Prevent auto-upload
  };
}
